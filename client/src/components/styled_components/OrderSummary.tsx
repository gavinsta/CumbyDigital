import { Box, Center, Container, GridItem, Heading, SimpleGrid, Spacer, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Booking } from "../../types/Booking"
import TimeText from "./TimeText"

const OrderSummary = ({ bookings }:
  { bookings: Booking[] }) => {
  //const [bookingArray, setBookingArray] = useState<Booking[]>(bookings)
  /*
  useEffect(() => {
    setBookingArray(bookings)
  }, [bookings])
  */
  function fullSummary(bookings: Booking[]) {
    bookings.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    })
    const allBookingDisplay: JSX.Element[] = []
    for (var booking of bookings) {
      allBookingDisplay.push(
        <>
          <GridItem
            alignContent={"center"}>
            <Text>{booking.date.toDateString()}</Text>
            <TimeText hour={booking.date.getHours()} />
          </GridItem>
          <GridItem>
            <Text>{booking.impressions}</Text>
          </GridItem>
          <GridItem>
            <Text>${booking.price.toFixed(2)}</Text>
          </GridItem>

          <GridItem>
            <Text>${(booking.price * booking.impressions).toFixed(2)}</Text>
          </GridItem>
        </>
      )
    }
    return allBookingDisplay;
  }
  return (
    < Center>
      <Stack>
        <Heading>
          Get your ad seen now!
        </Heading>
        {bookings.length > 0 ? <SimpleGrid
          columns={4}
          templateColumns={"2fr 1fr 1fr 1fr"}>
          {fullSummary(bookings)}
        </SimpleGrid> :
          <Box borderWidth={"medium"}
            padding={4}
            fontSize={20}
            borderStyle="dotted"
            borderColor={"salmon"}
            borderRadius={5}
          >
            <Text fontWeight={"black"} color="orange.500"> Limited Time offer!</Text>
            Get 1350 impressions a day for just $99 a week per direction!
            <Text>Sign up now!</Text>

          </Box>}
        <Spacer h={5} />
      </Stack>

    </Center>


  )
}

export default OrderSummary