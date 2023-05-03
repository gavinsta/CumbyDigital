export type Order = {
  date: Date,
  email: string,
  firstName: string,
  lastName: string,
  businessName?: string,
  /**"East" means west-bound traffic, etc. */
  direction: "east" | "west" | "both"
  /**Number of weeks this customer wants to keep this service */
  weeks: number,

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