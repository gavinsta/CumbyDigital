import { Text } from "@chakra-ui/react"

const AvailabilityCounter = ({ impressions, max }: { impressions: number, max: number }) => {
  function getStyle() {
    if (max == 0) {
      return { color: "white", bg: "red" }
    }
    else if (max - impressions == 0) {
      return { color: "white", bg: "green" }
    }
    else return { color: "white", bg: "" }
  }

  if (max == 0) {
    return (<Text
      textAlign={"center"}
      color="white"
      bg="red.400"
    >
      {`No impressions left at this time!`}
    </Text >)
  }
  else if (impressions == max) {
    return (<Text
      textAlign={"center"}
      color="white"
      bg="green.400"
    >
      {`You got the last one!`}
    </Text >)
  }
  return (<Text
    textAlign={"center"}
    style={getStyle()}
  >
    {!Number.isNaN(impressions) ? `${max - impressions} Left` : `${max} Left`}
  </Text>)
}
export default AvailabilityCounter