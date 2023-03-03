import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useCheckMobileScreen from "../hooks/useCheckMobileScreen";

const Title = () => {
  const isMobile = useCheckMobileScreen()
  return (
    <Heading
      fontFamily={"heading"}
      color={"coral"}
      fontWeight={"black"}
      fontSize={isMobile ? "90px" : "12rem"}
      blendMode={"difference"}
      position="static"
    >
      Cumby Digital
    </Heading>

  )
}
export default Title