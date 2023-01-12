export type Order = {
  email: string,
  status: "pending" | "confirmed" | "rejected",
  bookingID: string,
  segments: BookedSegment[]
}

export type BookedSegment = {
  impressionsBooked: number,
  date: Date,//year, month, day format
  status: "pending" | "confirmed"
}