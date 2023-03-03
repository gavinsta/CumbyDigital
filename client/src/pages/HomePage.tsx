import { AspectRatio, Box, Center, Container, Grid, GridItem, Heading, HStack, Image, SimpleGrid, Spacer, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import CheckoutForm from "../components/forms/CheckoutForm";
import ImageSubmission from "../components/ImageSubmission";
import TimeSelection from "../components/TimeSelection";
import Title from "../components/Title";
import useCheckMobileScreen from "../hooks/useCheckMobileScreen";
import { Booking } from "../types/Booking";
import { LimitedTimeOffer } from "./page-content/Content";
const HomePage: React.FC = () => {
  const [upload, setUpload] = useState<File | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const isMobile = useCheckMobileScreen();
  return (
    <Box
      height={"fit-content"}
    //bgImage={"/billboard_construction_1.jpg"}

    >
      <Box
        h={isMobile ? "100vh" : ""}
        bgImage="linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, .8)) , url('/photos/billboard_construction_1.jpg')"
        bgSize={"cover"}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="top"
        padding={isMobile ? 10 : 100}>

        <Heading
          //blendMode={"exclusion"}
          color="coral"
          //textAlign={"center"}
          fontSize={isMobile ? "35px" : "3rem"}
          fontWeight={"bold"}
        >
          Advertising made simple.
        </Heading>
        <Center
          height={"70%"}
          padding={isMobile ? 10 : 25}
          pt={isMobile ? 0 : 25}
        >
          <Title />
        </Center>

      </Box>

      <Box
        bgImage="linear-gradient(rgba(0, 0, 0, 0.8),rgba(255, 127, 80, 0.8)), url('/photos/billboard_construction_1.jpg')"
        bgSize={"cover"}
        padding={isMobile ? 0 : 20}
        pt={isMobile ? 45 : 0}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="top"
        h={isMobile ? "100vh" : ""}
      >
        <Heading
          textAlign={"center"}
          fontSize={isMobile ? "75px" : "8rem"}
          fontWeight={"bold"}
          blendMode={"difference"}
          color="white">
          Location
        </Heading>
        {isMobile ? <Spacer h={"5%"} /> : <></>}
        <Container
          justifyContent={"center"}
          maxWidth={"700px"}
          color={"white"}
          fontWeight={"semibold"}
          bg={isMobile ? "" : "rgba(0, 0, 0,0.7)"}
          borderRadius={isMobile ? 0 : "30"}
          boxShadow={"2xl"}
          padding={isMobile ? 0 : 10}>
          <Text
            textAlign={"center"}
            color={"white"}>Located on the I-30 between Greenville and Sulphur Springs</Text>
          <AspectRatio
            ratio={isMobile ? 1 : 16 / 6}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d427673.2116257351!2d-96.1208604216479!3d33.130189627889415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864bce2388ec74c7%3A0xa72f13939c9fdd4!2sThe%20Billboard%20House!5e0!3m2!1sen!2sus!4v1671916570201!5m2!1sen!2sus" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </AspectRatio>
        </Container>
      </Box>

      <Box
        bgImage="linear-gradient(rgba(0, 0, 0, 0.6),rgba(0,0,0,0.9)), url('photos/fireworks.jpg')"

        bgSize={"cover"}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="right"

        h={isMobile ? "110vh" : ""}
        padding={isMobile ? 5 : 20}
        pt={isMobile ? 45 : 0}
      >

        <LimitedTimeOffer />
      </Box>
      <ImageSubmission
        setImageBlob={setUpload}
      />

      <Box bgImage="linear-gradient(rgba(0, 0, 0, 00),rgba(0,0,0,0.8)), url('photos/fireworks.jpg')"

        bgSize={"cover"}
        padding={isMobile ? 0 : 20}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="right"
      >
        <CheckoutForm
          upload={upload}
          bookings={bookings} />
        <Spacer h={50} />
      </Box>
    </Box >
  )
}
export default HomePage