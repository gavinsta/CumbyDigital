import { Button, ComponentDefaultProps, Text } from "@chakra-ui/react";
const TimeText = ({ children, hour, minutes, format }: { hour: number, minutes?: number, format?: "military" | "standard" } & ComponentDefaultProps) => {



  return (
    <Text
      width={"max-content"}

      bg="salmon"
      color={"white"}
      padding={1}
      borderRadius={5}
      style={{
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
      textAlign={"center"}>
      {timeText("standard", hour, minutes)}
    </Text>
  )
}

export default TimeText

export function timeText(format: "military" | "standard", hour: number, minutes?: number) {

  if (!format) format = "military"
  if (!minutes) {
    minutes = 0
  }
  else if (minutes >= 59) {
    minutes = minutes % 60
  }
  const minuteText = minutes >= 10 ? `${minutes}` : `0${minutes}`

  if (format == "military") {
    return hour >= 10 ? `${hour}:${minuteText}` : `0${hour}:${minuteText}`
  }
  else if (format == "standard") {
    if (hour < 12) return hour == 0 ? `12:${minuteText} AM` : `${hour}:${minuteText} AM`
    else {
      return `${hour - 12}:${minuteText} PM`
    }
  }
}