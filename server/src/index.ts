import express, { Express, Request, Response } from "express"
import dotenv from "dotenv";
import path from "path";

import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import { base64_decode, generateBookingID, readBookingsFromCSV } from "./utils/bookingManagement";
import Stripe from 'stripe';

const CUMBY_DIGITAL_VERSION = 1.1;

dotenv.config();
//if we're in production use the proper stripe key. Otherwise...
const stripe = new Stripe(process.env.NODE_ENV == "production" ? process.env.STRIPE_SECRET_KEY! : process.env.STRIPE_SECRET_TEST_KEY!, {
  apiVersion: '2022-11-15'
});
//import * as dbAccess from "./utils/databaseUtills"
interface BookingForm {
  email: string,
  bookingReference: string
}


const app: Express = express();
app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(express.json())
const PORT = process.env.PORT || 8080;
//TODO note the various modes are production, staging and development


app.post("/api/create-checkout-session", async (req, res) => {
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

app.post('/api/new_order', async (req: Request, res: Response) => {
  console.log("Creating new order");
  var exit = false;
  const { image64, customerDetails, orderSummary, stripeToken } = req.body;
  //TODO check that order is valid if it is generate a booking ID
  let bookingID = generateBookingID(5);
  if (process.env.NODE_ENV === "testing") {
    bookingID = bookingID + "_TESTING"
  }
  const { email, firstName, lastName, businessName } = customerDetails;
  const { direction } = orderSummary;
  const charge = direction === "both" ? 19800 : 9900

  try {
    await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`,
      source: stripeToken,
      metadata: {
        bookingID: bookingID,
        direction: direction,
      }
    }).then(customer =>
      stripe.charges.create({
        amount: charge,
        currency: "usd",
        customer: customer.id,
        capture: false,
      })).then(() => res.status(200).json({
        result: "success",
        title: "New customer created",
        bookingID: bookingID
      })).catch(reason => {
        exit = true;
        console.log(reason);
        res.status(400).json({
          result: "failure",
          title: reason.raw.message
        })
      })
  }
  catch (err) {
    //console.log(err)
    res.send(err);
    return;
  }
  if (exit) {
    return;
  }
  if (image64) {
    //console.log(image);
    var fileExt = image64.substring("data:image/".length, image64.indexOf(";base64"));
    var imageName = `booking_images/${bookingID}_${firstName}_${lastName}.${fileExt}`;
    base64_decode(image64, imageName);

    //var file = new File([image], imageName, { type: "image/png", lastModified: new Date().getTime() })
  }
});
/*
app.post('/api/findbooking', async (req: Request, res: Response) => {
  const { email, bookingReference }: { email: string, bookingReference: string } = req.body;
  console.log(`Email: ${email}\nBooking Reference: ${bookingReference}`)

  //const result = await dbAccess.findBooking(email, bookingReference);
  if (!result.user) {
    return res.status(404).json({ status: "error", title: result.title, text: result.text, user: null })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: result.title, text: result.text, user: result.user })
});
*/

app.get('/api/booking', async (req: Request, res: Response) => {
  if (req.params.bookingID) {
    //Find the specific booking
    return {};
  }
  const bookedTimes = await readBookingsFromCSV();
  return res.status(200).json({
    bookedTimes: bookedTimes
  });

});
if (process.env.NODE_ENV === 'testing') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}
else if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}
else if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});