import fs, { appendFile, writeFile } from "fs/promises";
import fssync from "fs"
import path from "path"
import { Order } from "../types/Order"
import { parse } from "csv-parse";
import express, { Router, Response, Request } from "express";
import Stripe from 'stripe';
import { saveImageFile } from "./imageManagement";
const BOOKING_PATH = process.env.BOOKING_PATH;
if (BOOKING_PATH) {
  console.log(`Writing CSVs to ${BOOKING_PATH}`)
}
else {
  console.error(`No BOOKING_PATH env set!`);
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
//start up checks
if (!ADMIN_PASSWORD) {
  console.log(`Missing ADMIN_PASSWORD!`)
}
//if we're in production use the proper stripe key. Otherwise...
const stripe = new Stripe(process.env.NODE_ENV == "production" ? process.env.STRIPE_SECRET_KEY! : process.env.STRIPE_SECRET_TEST_KEY!, {
  apiVersion: '2022-11-15'
});
/** All of the special pricing models */
let SPECIAL_CODES: { code: string, products: { direction: string, price: string }[] }[];
if (process.env.NODE_ENV === "development") {
  SPECIAL_CODES = [
    {
      code: "1350for99",
      products: [
        {
          direction: "east",
          price: "price_1MP9guDCQYL7duwLEhfXf6FU"
        },
        { direction: "west", price: "price_1MP9guDCQYL7duwLEhfXf6FU" },
        { direction: "both", price: "price_1MP9guDCQYL7duwLEhfXf6FU" }
      ]
    }
  ]
}
else {
  SPECIAL_CODES = [
    {
      code: "1350for99",
      products: [
        {
          direction: "east",
          price: "price_1MUEE3DCQYL7duwLgXLSpdZ7"
        },
        { direction: "west", price: "price_1MUEEPDCQYL7duwLdKw1nTPG" },
        { direction: "both", price: "price_1MUEEnDCQYL7duwLOVoi8euU" }
      ]
    }
  ]
}

interface BookingSummary {
  bookingID: string,
  date: string,
  email: string,
  firstName: string,
  lastName: string,
  businessName?: string,
  direction: "east" | "west" | "both",
  segments: string | number,
  bookingStatus: "pending" | "confirmed" | "rejected",
  specialCode?: string
}
let bookings: BookingSummary[] = []
//initialize the array on startup
readBookingsFromCSV();

function findProductsForSpecialCode(code: string) {
  const first = SPECIAL_CODES.find((codeObj) => codeObj.code == code);
  if (first) {
    return first;
  }
  else return null;
}

function findPriceCodeForSpecialCode(code: string, direction: "west" | "east" | "both") {
  const productObj = findProductsForSpecialCode(code);
  if (productObj) {
    const priceObj = productObj.products.find(x => x.direction == direction);
    if (priceObj) {
      return priceObj.price;
    }
  }
  return null;
}
const router: Router = express.Router({ mergeParams: true })
router.post('/', async (req: Request, res: Response) => {
  const date = new Date();
  console.log(`**${date.toDateString()}: Creating new order**`);
  const { image64, customerDetails, orderSummary, stripeToken } = req.body;
  //TODO check that order is valid if it is generate a booking ID
  let bookingID = generateBookingID(5);
  if (process.env.NODE_ENV === "testing") {
    bookingID = bookingID + "_TESTING"
  }
  const { email, firstName, lastName, businessName } = customerDetails;
  const { direction, specialCode, segments } = orderSummary;
  const charge = direction === "both" ? 19800 : 9900
  const order: Order = {
    date: date,
    email: email,
    firstName: firstName,
    lastName: lastName,
    bookingID: bookingID,
    direction: direction,
    status: "pending",
    segments: segments,
    specialCode: specialCode
  }
  let customer: Stripe.Customer | undefined;
  try {
    customer = await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`,
      source: stripeToken,
      metadata: {
        bookingID: bookingID,
        direction: direction,
        businessName: businessName,
      }
    });
    res.status(200).json({
      result: "success",
      title: "New customer created",
      bookingID: bookingID,
    });
  }
  catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      res.status(400).json({
        result: "failure",
        title: err.message
      });
    }
    else if (err instanceof Stripe.errors.StripeError)
      //console.log(err)
      res.status(400).json({ title: `Error creating new customer`, result: "failure", details: err });
    return;
  }

  //customer check
  if (!customer) {
    return;
  }

  const price = findPriceCodeForSpecialCode(specialCode, direction);
  if (specialCode && price) {

    const startDate = new Date();
    startDate.setDate(date.getDate() + 5);
    try {
      const schedule = await stripe.subscriptionSchedules.create({
        customer: customer.id,
        start_date: Math.floor(startDate.getTime() / 1000),
        end_behavior: 'release',
        phases: [
          {
            items: [{ price: price, quantity: 1 }],
            iterations: 48,
          },
        ],
      });
    }
    catch (err) {
      if (err instanceof Error) {
        console.log(err);
        res.status(400).json({
          result: "failure",
          title: err.message
        });
        return;
      }
      else if (err instanceof Stripe.errors.StripeError)
        //console.log(err)
        res.status(400).json({ title: `Error adding subscription`, result: "failure", details: err });
      return;
    }
  }

  if (!image64) {
    res.json({ result: "failure", title: "No image uploaded!" })
  }
  //console.log(image);
  var fileExt = image64.substring("data:image/".length, image64.indexOf(";base64"));
  var imageName = `${bookingID}_${firstName}_${lastName}.${fileExt}`;
  saveImageFile(image64, imageName);
  addBookingToCSV(order);
});
router.post('/admin-view', async (req: Request, res: Response) => {
  if (req.body.password === ADMIN_PASSWORD) {

    try {
      await readBookingsFromCSV();
      res.status(200).json({
        bookings: bookings
      })
    }
    catch (err) {
      console.log(err);
    }
  }
  else {
    res.status(400).json({
      title: "Admin log in failed",
    })
  }
});
router.post('/admin-edit', async (req: Request, res: Response) => {
  if (req.body.password === ADMIN_PASSWORD) {
    if (req.body.bookings) {
      //
      const changes: BookingSummary[] = req.body.bookings;
      const rows = changes.map(createRowFromBookingSummary);

      const header = "Booking ID,Date,Email,First Name,Last Name,Business Name,Direction,No. of segments,Booking Status,Special Code"
      try {
        const writesuccess = await writeCSV("bookingOrders.csv", header, rows);
        if (writesuccess) {
          await readBookingsFromCSV();
        }
        res.status(200).json({
          title: "Changes saved",
          result: "success",
          bookings: bookings
        })
      }
      catch (err) {
        console.log(err);
        res.status(400).json({
          title: "Writing to CSV failed"
        })
      }
    }
  }
  else {
    res.status(401).json({
      title: "Admin log in failed",
    })
  }
});
/**view specific bookings! */
router.get('/:bookingID', async (req: Request, res: Response) => {
  let summary: BookingSummary | null = null;

  if (req.params.bookingID) {
    const bookingID = req.params.bookingID;
    console.log(`Searching for booking: ${bookingID}`)
    bookings.forEach((_summary) => {
      if (_summary.bookingID === bookingID) {
        summary = _summary;
      }
    })
    //read booked times eventually!
    //const bookedTimes = await readBookingsFromCSV();
  }

  if (summary) {
    return res.status(200).json({
      bookings: [summary]
      //bookedTimes: bookedTimes
    });
  }
  else {
    return res.status(400).json({
      title: "Could not find booking with this ID"
    })
  }


});

//TODO for later in case they want to purchase certain products
router.post("/checkout-session", async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price,
        },
        quantity: product.quantity,
      },
    ],
    mode: "setup",
    success_url: "/success",
    cancel_url: "/cancel",
  });
  res.json({ id: session.id });
});
function createRowFromBookingSummary(booking: BookingSummary) {
  return `${booking.bookingID},${booking.date},${booking.email},${booking.firstName},${booking.lastName},${booking.businessName},${booking.direction},${booking.segments},${booking.bookingStatus},${booking.specialCode}`;
}
export async function addBookingToCSV(order: Order): Promise<boolean> {
  const summary: BookingSummary = {
    bookingID: order.bookingID,
    date: order.date.toDateString(),
    email: order.email,
    firstName: order.firstName,
    lastName: order.lastName,
    direction: order.direction,
    segments: order.segments.length,
    bookingStatus: order.status,
    specialCode: order.specialCode
  }
  //TODO add booking segments
  /*
  order.segments.forEach((seg) => {
    const csvRow = `${seg.date.toDateString()},${seg.date.getHours()},${seg.impressionsBooked},${order.bookingID}\n`;
    try {
      appendFileSync(`${BOOKING_PATH}/bookingsByDate.csv`, csvRow);
    }
    catch (e) {
      console.log(e);
    }
  });
*/

  const bookingInfo = "\n" + createRowFromBookingSummary(summary);

  try {
    await fs.appendFile(`${BOOKING_PATH}/bookingOrders.csv`, bookingInfo);
  }
  catch (e) {
    console.log(e)
    return false;
  }
  return true;
}

async function writeCSV(fileName: string, header: string, rows: string[]): Promise<boolean> {
  try {
    const content = header.concat("\n" + rows.join("\n"));
    await fs.writeFile(`${BOOKING_PATH}/${fileName}`, content);
  }
  catch (err) {
    console.log(err)
    return false;
  }
  return true;
}
export function readBookingSegmentsFromCSV(): Promise<{ date: Date, impressions: number }[]> {
  let segments: { date: Date, impressions: number }[] = [];
  return new Promise((resolve, reject) => {
    fssync.createReadStream(`${BOOKING_PATH}/bookingsByDate.csv`)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        const date = new Date(row[0]);
        date.setHours(row[1]);
        const impressionsBooked = row[2]
        console.log(`${date}: ${impressionsBooked}`);
        segments.push({ date: date, impressions: impressionsBooked });
      })
      .on('end', () => {
        resolve(segments);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export async function readBookingsFromCSV() {
  bookings = []
  const parser = fssync
    .createReadStream(`${BOOKING_PATH}/bookingOrders.csv`)
    .pipe(parse({
      delimiter: ",", from_line: 2
    }));
  for await (const row of parser) {
    // Work with each record
    const booking: BookingSummary = {

      bookingID: row[0],
      date: row[1],
      email: row[2],
      firstName: row[3],
      lastName: row[4],
      businessName: row[5],
      direction: row[6],
      segments: Number(row[7]),
      bookingStatus: row[8],
      specialCode: row[9]
    }
    bookings.push(booking)
  }
}

const base64_encode = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const generateBookingID = (length: number) => {
  var s = '';
  var randomCapitalChar = function () {
    var n = Math.floor(Math.random() * 26) + 65;
    return String.fromCharCode(n);
  }
  var randomNumber = function () {
    var n = Math.floor(Math.random() * 10);
    return n;
  }
  var toggle = true;
  while (s.length < length) {
    if (toggle) {
      s += randomCapitalChar();
      toggle = false;
    }
    else {
      s += randomNumber();
      toggle = true;
    }
  }
  return s;
}

export default router;