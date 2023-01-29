import express, { Express, Request, Response } from "express"
import dotenv from "dotenv";
dotenv.config();

import path from "path";

import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import bookingRouter, { addBookingToCSV, readBookingsFromCSV } from "./routers/bookingManagement";
import imageRouter, { getAllBookingImagePaths } from "./routers/imageManagement"
import { Order } from "./types/Order";


const CUMBY_DIGITAL_VERSION = process.env.VERSION;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
//start up checks
if (!ADMIN_PASSWORD) {
  console.log(`Missing ADMIN_PASSWORD!`)
}
const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  console.log(`Missing NODE_ENV`);
}
else console.log(`Environment: ${process.env.NODE_ENV}`);
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

app.use('/api/booking', bookingRouter);

app.use('/api/images', imageRouter);

//TODO log in section?
app.post('/api/login', (req: Request, res: Response) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

app.get('/api/version', (req: Request, res: Response) => {
  return res.status(200).json({
    version: CUMBY_DIGITAL_VERSION,
    mode: NODE_ENV,
  })
});
if (process.env.NODE_ENV === 'testing') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });

  app.post('/api/test/booking/:id', async (req: Request, res: Response) => {
    const version = req.params.id
    const order: Order = {
      date: new Date(),
      email: `test${version}@testmail.com`,
      firstName: "test",
      lastName: `lastName ${version}`,
      direction: "both",
      bookingID: `TEST_${version}`,
      status: "pending",
      segments: []
    }
    const success = await addBookingToCSV(order);
    if (success) {
      return res.status(200).json({ result: "success", title: "bookings added to CSV" })
    }
    else return res.status(400).json({ result: "failure", title: "Could not add to csv" })
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