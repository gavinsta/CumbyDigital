import { Alert, Box, Button, ButtonGroup, Card, Container, Grid, GridItem, HStack, Icon, Input, NumberInput, NumberInputField, Progress, SimpleGrid, Spacer, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { PricingChart } from "../../types/PricingChart";
import TimeText, { timeText } from "../styled_components/TimeText";
import { Booking } from "../../types/Booking";
import { FiClock } from "react-icons/fi"
import { AiFillDollarCircle } from "react-icons/ai"
import AvailabilityCounter from "../styled_components/AvailabilityCounter";

const WeekDisplay = ({ startingDate, maxImpressions, unavailableTimes, pricingChart, selectTimes }: {
  selectTimes: (date: Date, impressions: number, price: number) => void
  startingDate: Date, maxImpressions: number,
  unavailableTimes: Map<Date, number>,
  pricingChart: PricingChart
}) => {
  /**Toggles viewing ALL prices or bookings */
  const [toggle, setToggle] = useState<boolean>(false);
  const [viewPrice, setViewPrice] = useState<boolean[]>(Array(24).fill(false));
  const [timeFormat, setTimeFormat] = useState<"standard" | "military">("standard");
  function toggleTimeFormatButton() {
    return (
      <Button
        height={"100%"}
        width={"50%"}

        color={"white"}
        bg="salmon"
        _hover={{ backgroundColor: "#f66b60" }}
        _active={{ backgroundColor: "coral" }}
        _selected={{ backgroundColor: "coral" }}
        onClick={() => {
          setTimeFormat(timeFormat == "standard" ? "military" : "standard")
        }}>
        <Stack>
          <Icon
            alignSelf={"center"}
            fontSize={30} as={FiClock} />
          <Text
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}>
            {timeFormat == "standard" ? "24 hour " : "12 hour"} clock
          </Text>
        </Stack>
      </Button>)
  }
  function togglePriceBookingViewButton() {

    return (<Button
      height={"100%"}
      width={"50%"}

      color={"white"}
      bg="salmon"
      _hover={{ backgroundColor: "#f66b60" }}
      _active={{ backgroundColor: "coral" }}
      _selected={{ backgroundColor: "coral" }}
      onClick={() => {
        setToggle(toggle => !toggle)
        if (toggle) {
          setViewPrice(Array(24).fill(false))
        }
        else {
          setViewPrice(Array(24).fill(true))
        }
      }}>
      <Stack>
        <Icon
          alignSelf={"center"}
          fontSize={30} as={AiFillDollarCircle} />
        <Text
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
          textAlign={"center"}>
          {toggle ? `View all availability` : "View all prices"}
        </Text>
      </Stack>

    </Button>)
  }
  function renderTimeButtons() {
    const elements = []
    for (var i = 0; i < 24; i++) {
      const hour = i;
      elements.push(
        <GridItem        >
          <Button
            variant={"solid"}
            bg="salmon"
            color={"white"}
            style={{
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
            _hover={{ backgroundColor: "#f66b60" }}
            _active={{ backgroundColor: "coral" }}
            height={"10vh"}
            width={"100%"}
            onClick={() => {

              const newArray = [...viewPrice]
              newArray[hour] = !newArray[hour];
              //console.log(`${hour} is ${collapsed[hour]}`)
              setViewPrice(newArray);
            }}>
            <Stack>
              <Text>{timeText(timeFormat, hour, 0)}
              </Text>
              <Text>
                {viewPrice[hour] ? "Book impressions!" : "View Pricing"}
              </Text>
            </Stack>

          </Button>
        </GridItem>
      )
    }
    return (elements)
  }
  function findPrice(date: Date): number {
    let price = pricingChart.baseRate;
    if (pricingChart) {
      for (var variableRate of pricingChart.variableRate) {
        if (variableRate.day.valueOf() == date.getDay() && variableRate.hour == date.getHours()) {
          price += variableRate.price;
          //console.log(`Rate on ${variableRate.day} should be ${pricingChart.baseRate + variableRate.price}`)
        }
      }
    }
    return price;
  }
  function checkTimesUnavailable(date: Date): number {
    if (unavailableTimes.has(date)) {
      //console.log(`Found ${date} in unavailable times`)
      const booked = unavailableTimes.get(date)
      if (booked) return booked;
      else return 0
    }
    return 0
  }
  function renderWeekView(date: Date) {
    const dates: Date[] = []
    const gridElements: JSX.Element[] = []
    var adjustedDate = new Date(date.toDateString())
    for (var offset = 0; offset < 7; offset++) {
      dates.push(adjustedDate)
      //increase by one day
      adjustedDate = new Date(adjustedDate)
      adjustedDate.setDate(adjustedDate.getDate() + 1)
    }
    for (var day of dates) {

      for (var i = 0; i < 24; i++) {
        const hour = i;
        var specificDate = new Date(day)
        specificDate.setHours(hour, 0, 0, 0)

        gridElements.push(<HourlyInput
          pricing={findPrice(specificDate)}
          selectTimes={selectTimes}
          date={specificDate}
          intervalsAvailable={maxImpressions - checkTimesUnavailable(specificDate)}
          viewPrice={viewPrice} />)
      }
    }
    return gridElements;
  }
  function headerButtons(date: Date) {
    function daysOfWeekLabel(date: Date) {
      const dates: Date[] = []
      const gridElements: JSX.Element[] = []
      var adjustedDate = new Date(date.toDateString())
      for (var offset = 0; offset < 7; offset++) {
        dates.push(adjustedDate)
        //increase by one day
        adjustedDate = new Date(adjustedDate)
        adjustedDate.setDate(adjustedDate.getDate() + 1)
      }
      for (var day of dates) {
        gridElements.push(<GridItem
          justifyContent={"center"}>
          <Text
            fontWeight={"bold"}
            fontSize={"1.2rem"}
            color={"white"}
            padding={5}
            borderRadius={10}
            textAlign={"center"}>
            {day.toDateString()}
          </Text>
        </GridItem >)
      }

      return gridElements;
    }
    return <>
      <GridItem
        justifyContent={"center"}
        alignContent="center">
        {toggleTimeFormatButton()}
        {togglePriceBookingViewButton()}

      </GridItem>
      {daysOfWeekLabel(date)}
    </>
  }
  /*
  function renderWeekView(date: Date) {
    const week: JSX.Element[] = []
  
    week.push(<DayView
      collapsed={collapsed}
      select={selectTimes}
      date={date}
    />)
    var adjustedDate = new Date(date)
    for (var offset = 0; offset < 6; offset++) {
      week.push(<DayView
        collapsed={collapsed}
        select={selectTimes}
        date={adjustedDate}
  
      />)
      adjustedDate = new Date(adjustedDate.setDate(adjustedDate.getDate() + 1))
    }
    return week;
  }
  */
  return (
    <Stack
      paddingBottom={5}
      spacing={0}>
      <SimpleGrid
        padding={2}
        borderTopRadius={10}
        bg="blackAlpha.700"
        spacing={2}
        gridAutoFlow={"column"}
        //height={"100%"}
        templateColumns={`1.5fr repeat(7,1fr)`}
      >
        {headerButtons(startingDate)}
      </SimpleGrid>
      <Box
        borderTopWidth={10}
        borderBottomWidth={10}
        borderColor={"rgba(0,0,0,0)"}
        width={"100%"}
        maxHeight={"50vh"}
        overflowY={"scroll"}
        borderBottomRadius={10}
        bg="blackAlpha.800"
        //paddingTop={2}
        marginTop={2}
      >


        <SimpleGrid

          padding={2}

          spacing={2}
          gridAutoFlow={"column"}
          templateRows={`repeat(24,1fr)`}
          templateColumns={`1.5fr repeat(7,1fr)`}
        >
          {renderTimeButtons()}
          {renderWeekView(startingDate)}
        </SimpleGrid>
      </Box>
    </Stack>




  )
}

/*
const DayView = ({ date, select, collapsed }: {
  date: Date,
  select: (date: Date, impressions: number) => void,
  collapsed: boolean[]
}) => {
  function createTimeInputs() {
    let elements: JSX.Element[] = []
    for (var i = 0; i < 24; i++) {
      elements.push(<HourlyInput
        selectTimes={select}
        hour={i}
        intervalsAvailable={450}
        collapsed={collapsed} />)
    }
    return elements;
  }
  return (<Stack
    alignContent={"center"}
    justifyContent="center"
    padding={1}
    width={"max-content"}
    bg={"whiteAlpha.500"}>
    <Button
      onClick={() => {
        // setCollapse(collapse => !collapse)

      }}>

      <Text>
        {date.toDateString()}
      </Text>

    </Button>
    {createTimeInputs()}
  </Stack>)
}
*/
function HourlyInput({ selectTimes, date, intervalsAvailable, viewPrice, pricing }:
  {
    selectTimes: (date: Date, impressions: number, pricing: number) => void,
    date: Date,
    intervalsAvailable: number,
    viewPrice: boolean[],
    pricing: number
  }) {
  const [impressions, setImpressions] = useState<number>(0);
  const max = intervalsAvailable
  const min = 0
  useEffect(() => {

    selectTimes(date, impressions, pricing);
  }, [impressions]);
  function indicateBooking() {
    if (impressions > 0) {
      return (<Progress
        colorScheme={"pink"}
        value={impressions / max * 100}
        borderRadius={15}
        marginLeft={"10%"}
        marginRight={"10%"}
      />)
    }
    else return <></>
  }

  if (viewPrice[date.getHours()]) {
    return (
      <Stack justifyContent={"center"}
        borderRadius={10}
        bg={date.getHours() % 2 == 0 ? "whiteAlpha.200" : "whiteAlpha.400"}
      >
        <Text color={"white"}
          textAlign={"center"}>
          {`$${pricing.toFixed(2)}`}
        </Text>
      </Stack>);
  }
  else return (


    <Stack alignContent={"center"}
      borderRadius={10}
      bg={date.getHours() % 2 == 0 ? "whiteAlpha.200" : "whiteAlpha.400"}>
      <NumberInput placeholder={"number of impressions"}
        min={min}
        max={max}
        color={"white"}
        onChange={(value) => {
          let val = parseInt(value)
          if (!Number.isNaN(val)) {
            if (val > max) {
              val = max;
            }
            else if (val < min) {
              val = min
            }
          }
          else {
            val = 0;
          }
          setImpressions(val)

        }}
        value={impressions}>
        <Stack>
          <AvailabilityCounter impressions={impressions} max={max} />
          <NumberInputField />
        </Stack>
      </NumberInput>
      {indicateBooking()}
    </Stack>

  );
}


export default WeekDisplay