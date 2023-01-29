export type Order = {
  date: Date,
  email: string,
  firstName: string,
  lastName: string,
  businessName?: string,
  /**"East" means west-bound traffic, etc. */
  direction: "east" | "west" | "both"
  status: "pending" | "confirmed" | "rejected",
  bookingID: string,
  segments: BookedSegment[],
  specialCode?: string,
}

export type BookedSegment = {
  impressionsBooked: number,
  date: Date,//year, month, day format
  status: "pending" | "confirmed"
}