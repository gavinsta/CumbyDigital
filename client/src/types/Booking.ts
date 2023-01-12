export type Booking = {
  date: Date,
  impressions: number,
  price: number,
  note?: string
}

export type Order = {
  bookings: Booking[],
  recurring: boolean,
  specialOffer: boolean
}