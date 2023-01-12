import { AspectRatio, Box, Center, Container, Grid, GridItem, Heading, HStack, Image, SimpleGrid, Spacer, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import CheckoutForm from "../components/forms/CheckoutForm";
import ImageSubmission from "../components/ImageSubmission";
import TimeSelection from "../components/TimeSelection";
import Title from "../components/Title";
import { Booking } from "../types/Booking";
const HomePage: React.FC = () => {
  const [upload, setUpload] = useState<File | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  return (
    <Box
      height={"fit-content"}
    //bgImage={"/billboard_construction_1.jpg"}

    >
      <Box
        bgImage="linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, .8)) , url('/photos/billboard_construction_1.jpg')"
        bgSize={"contain"}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="top"
        padding={100}>


        <Heading
          //blendMode={"exclusion"}
          color="coral"
          //textAlign={"center"}
          fontSize={"3rem"}
          fontWeight={"bold"}
        >
          Advertising made simple.
        </Heading>
        <Center
          height={"70%"}
          padding={25}
        >
          <Title />
        </Center>

      </Box>

      <Box
        bgImage="linear-gradient(rgba(0, 0, 0, 0.8),rgba(255, 127, 80, 0.8)), url('/photos/billboard_construction_1.jpg')"
        bgSize={"cover"}
        padding={20}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="top"
      >
        <Heading
          textAlign={"center"}
          fontSize={"8rem"}
          fontWeight={"bold"}
          blendMode={"difference"}
          color="white">
          Location
        </Heading>

        <Container
          justifyContent={"center"}
          maxWidth={"700px"}
          color={"white"}
          fontWeight={"semibold"}
          bg={"rgba(0, 0, 0,0.7)"}
          borderRadius="30"
          boxShadow={"2xl"}
          padding={10}>
          <Text
            textAlign={"center"}
            color={"white"}>Located on the I-30 between Greenville and Sulfur Springs</Text>
          <AspectRatio
            ratio={16 / 6}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d427673.2116257351!2d-96.1208604216479!3d33.130189627889415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864bce2388ec74c7%3A0xa72f13939c9fdd4!2sThe%20Billboard%20House!5e0!3m2!1sen!2sus!4v1671916570201!5m2!1sen!2sus" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </AspectRatio>
        </Container>
      </Box>

      <Box
        bgImage="linear-gradient(rgba(0, 0, 0, 0.6),rgba(0,0,0,0.9)), url('photos/fireworks.jpg')"

        bgSize={"cover"}
        padding={20}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="right"
      >
        <Heading
          textAlign={"center"}
          fontSize={"8rem"}
          fontWeight={"bold"}
          //blendMode={"color-dodge"}
          color="rgba(255,127,80,0.8)">
          How does it work?
        </Heading>


        <Container
          justifyContent={"center"}
          maxW={"700px"}
          color={"white"}
          fontWeight={"semibold"}
          bg={"rgba(0, 0, 0,0.7)"}
          borderRadius="30"
          boxShadow={"2xl"}
          padding={10}
          pl={50}
          pr={50}

        >
          <Container>
            <Text>
              Cumby Digital is dedicated to making your advertising experience as easy as possible.
            </Text>
            <Spacer h={"1rem"} />
            <Text>
              We split up the showing time into
            </Text>
            <Heading
              borderBottomWidth={5}
              borderBottomColor={"salmon"}
            >8 second impressions
            </Heading>
            <Text>
              (450 impressions per hour).
            </Text>
            <Spacer h={"1rem"} />
            <Text>
              Simply purchase the amount of impressions <i>you</i> want!
            </Text>
            <Spacer h={"1rem"} />
            <Text>
              With a minimum purchase of 1200 impressions per month and $29.99 per image upload.
            </Text>
            <Text>
              Space out your ad perfectly to catch the attention of commuters!
            </Text></Container>
        </Container>

      </Box>
      <ImageSubmission
        setImageBlob={setUpload}
      />
      <Box bgImage="linear-gradient(rgba(0, 0, 0, 00),rgba(0,0,0,0.8)), url('photos/fireworks.jpg')"

        bgSize={"cover"}
        padding={20}
        bgRepeat="no-repeat"
        bgAttachment={"fixed"}
        bgPosition="right">
        <Spacer h={50} />



        <CheckoutForm
          upload={upload}
          bookings={bookings} />
        <Spacer h={50} />
      </Box>
    </Box >
  )
}
export default HomePage