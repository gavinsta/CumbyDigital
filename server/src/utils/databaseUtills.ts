/*
import mariadb from "mariadb"
import dotenv from "dotenv";
dotenv.config();
let port = 3306
if (process.env.DB_PORT) {
  port = parseInt(process.env.DB_PORT)
}
//BUG weird case of camelcase trickery
const BOOKING_TABLE = "BOOKING_TABLE"
const pool = mariadb.createPool({
  //In production we will use the docker container address
  host: process.env.DB_HOST,
  port: port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "CUMBY_DIGITAL"
})

export const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection().then((connection) => {
      resolve(connection);
    }).catch((error) => {
      reject(error);
    })
  })
}
//find a previous booking
export const findBooking = (email: string, bookingReference: string) => {

}

//make a new booking
export const newBookingRequest = () => {

}
*/