import { Card, CardHeader, CardBody, Input, Text, Button, HStack, ButtonGroup, Box, Stack, Alert, NumberInput, NumberInputField, Center, Container, Popover, PopoverTrigger, PopoverAnchor, PopoverArrow, PopoverHeader, PopoverBody, PopoverFooter, Heading, ChakraProps, Checkbox } from "@chakra-ui/react"
import { create } from "domain"
import { FormEvent, forwardRef, useEffect, useRef, useState } from "react"
import { BsSearch } from "react-icons/bs"
import { PricingChart, Weekdays } from "../types/PricingChart"
import WeekDisplay from "./booking-calendar/WeekDisplay"
import { DatePicker } from "./styled_components/DatePicker"
import TimeText from "./styled_components/TimeText"
import { Booking } from "../types/Booking"

const DEFAULT_RATE = 0.1;
export interface TimeSelectionProps extends ChakraProps {
  bookings: Booking[],
  setBookings: (bookings: Booking[]) => void
}
const TimeSelection = (props: TimeSelectionProps) => {

  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const { bookings, setBookings } = props
  const [existingBookings, setExistingBookings] = useState<Map<Date, number>>(new Map())
  //On load make a fetch request for data
  useEffect(() => {
    loadBookingData();
  }, [])

  //load localstorage booking data
  /*
  useEffect(() => {
    const previousBooking = localStorage.getItem("booking");
    if (previousBooking) {
      setBookings(JSON.parse(previousBooking))
    }
  }, [])
*/
  async function loadBookingData() {
    try {
      const res = await fetch(`/api/booking`, {
        method: "GET"
      });
      if (res.ok) {
        const json = await res.json() as { bookedTimes: { date: Date, impressions: number }[] };
        console.log(json);
        const newBookingMap = new Map<Date, number>();
        json.bookedTimes.forEach((x) => { newBookingMap.set(x.date, x.impressions) });
        setExistingBookings(newBookingMap);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  function addOrReplaceBooking(newBooking: Booking) {
    for (var segment of bookings) {
      if (newBooking.date.getTime() === segment.date.getTime()) {
        const newBookings = [...bookings]
        newBookings.splice(bookings.indexOf(segment));
        newBookings.push(newBooking);
        setBookings(newBookings);

        localStorage.setItem("booking", JSON.stringify(newBookings))
        console.log(localStorage.getItem("booking"))
        return;
      }
    }
    //if no previous booking matches
    const newBookings = [...bookings]
    newBookings.push(newBooking)
    setBookings(newBookings)
    localStorage.setItem("booking", JSON.stringify(newBookings))
    console.log(localStorage.getItem("booking"))
  }

  function removeBooking(date: Date) {
    for (var segment of bookings) {
      if (date.getTime() === segment.date.getTime()) {
        const newBookings = [...bookings]
        newBookings.splice(bookings.indexOf(segment));
        setBookings(newBookings);

        localStorage.setItem("booking", JSON.stringify(newBookings))
        console.log(localStorage.getItem("booking"))
        return;
      }
    }
  }
  /**
   * Handles selection of dates and the respective number of impressions the user would like to book.
   * @param date 
   * @param impressions 
   */
  function selectTimes(date: Date, impressions: number, price?: number) {
    //check if the date is already in the booking
    if (impressions == 0) {
      removeBooking(date);
      return;
    }
    if (!price) { price = DEFAULT_RATE }
    const newBooking = { date, impressions, price: price }
    addOrReplaceBooking(newBooking)
  }


  function clearBooking() {
    localStorage.removeItem("booking")
  }

  let pricingChart: PricingChart = {
    baseRate: 0.1,
    variableRate: [{ day: Weekdays.Wednesday, hour: 17, price: 0.04 }, { day: Weekdays.Wednesday, hour: 18, price: 0.04 }, { day: Weekdays.Wednesday, hour: 19, price: 0.04 }]
  }
  /*
  let bookingMap = new Map<string, number>([[new Date("December 30 2022, 08:00:00").toString(), 450], [new Date("December 31 2022, 08:00:00").toString(), 150], [new Date("December 31 2022, 010:00:00").toString(), 200]])
*/

  return (
    <Box
      //bgImage="linear-gradient(rgba(255, 127, 80, 0.8), rgba(0, 0, 0, 0.8)),url('/photos/billboard_construction_1.jpg')"
      bgImage="linear-gradient(rgba(0, 0, 0, 0.8),rgba(255, 127, 80, 0.8)), url('/photos/billboard_construction_1.jpg')"
      bgSize={"cover"}
      bgRepeat="no-repeat"
      bgAttachment={"fixed"}
      bgPosition="top"

      //bg={"blue.300"}
      justifyContent="center"
      alignContent={"center"}
      paddingTop={10}
    >
      <Heading
        textAlign={"center"}
        fontSize={"8rem"}
        fontWeight={"bold"}
        blendMode={"color-dodge"}
        color="rgba(255,255,255,0.8)">
        Booking
      </Heading>
      <HStack
        fontSize={20}
        color={"white"}
        padding={5}
        justifyContent={"center"}
      >

        <Stack
          borderTopLeftRadius={40}
          borderBottomRightRadius={40}
          padding={5}
          boxShadow={"base"}
          bg="salmon"
        //width={"50%"}
        >
          <Text
            fontWeight={"semibold"}>
            Pick a date
          </Text>

          <DatePicker

            selected={viewDate}
            onChange={(d) => {
              if (d) {
                const date = new Date(d);
                date.setHours(0, 0, 0, 0)
                setViewDate(date)
              }
            }}
          //isClearable={true} 
          />
        </Stack>

        <Stack
          borderTopLeftRadius={40}
          borderBottomRightRadius={40}
          padding={5}
          boxShadow={"base"}
          bg="salmon"
          color={"white"}>
          <Checkbox
            onChange={(event) => {
              console.log(`CHECKBOX: ${event.target.checked}`)
            }}
          >
            Recurring Monthly
          </Checkbox>
        </Stack>


        <Stack
          borderTopLeftRadius={40}
          borderBottomRightRadius={40}
          padding={5}
          boxShadow={"base"}
          bg="salmon"
          border="white"
          color={"white"}>
          <Text fontWeight={"bold"}>
            Limited Time Special Offer!
          </Text>
          <Text>1350 ads per day for $99/week!</Text>
          <Button
            fontWeight={"bold"}
            colorScheme={"blue"}>
            Sign me up!
          </Button>
        </Stack>

      </HStack>
      <Center
        paddingLeft={50}
        paddingRight={50}
        boxShadow="2xl">
        <WeekDisplay
          selectTimes={selectTimes}
          startingDate={viewDate}
          pricingChart={pricingChart}
          maxImpressions={450}
          unavailableTimes={existingBookings}
        />
      </Center>

    </Box>
  )
}

export default TimeSelection