export type PricingChart = {
  baseRate: number,
  variableRate: { day: Weekdays, hour: number, price: number }[]
}

export enum Weekdays {
  "Sunday" = 0, "Monday" = 1, "Tuesday" = 2, "Wednesday" = 3, "Thursday" = 4, "Friday" = 5, "Saturday" = 6
}