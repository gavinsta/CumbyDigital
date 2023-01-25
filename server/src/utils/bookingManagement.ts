import fs, { appendFileSync } from "fs";
import { Order } from "../types/Booking"
import { parse } from "csv-parse";
export function addBookingToCSV(booking: Order) {
  booking.segments.forEach((seg) => {
    const csvRow = `${seg.date.toDateString()},${seg.date.getHours()},${seg.impressionsBooked},${booking.bookingID}\n`;
    try {
      appendFileSync("bookings/bookingsByDate.csv", csvRow);
    }
    catch (e) {
      console.log(e)
    }
  });

  const bookingInfo = `${booking.email},${booking.bookingID},${booking.segments.length},${booking.status}`;
  console.log(bookingInfo);
  try {
    appendFileSync("bookings/bookingOrders.csv", bookingInfo);
  }
  catch (e) {
    console.log(e)
  }
}

export function readBookingsFromCSV(): Promise<{ date: Date, impressions: number }[]> {
  let bookings: { date: Date, impressions: number }[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("bookings/bookingsByDate.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        const date = new Date(row[0]);
        date.setHours(row[1]);
        const impressionsBooked = row[2]
        console.log(`${date}: ${impressionsBooked}`);
        bookings.push({ date: date, impressions: impressionsBooked });
      })
      .on('end', () => {
        resolve(bookings);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export function base64_decode(base64Image: string, fileName: string) {
  const buffer = Buffer.from(base64Image.split(",")[1], "base64");
  fs.writeFileSync("../../booking_images/" + fileName, buffer, "base64");
  console.log('******** File created from base64 encoded string ********');
}


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