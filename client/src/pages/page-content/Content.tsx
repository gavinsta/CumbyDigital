import { Container, Heading, Spacer, Text } from "@chakra-ui/react";
import useCheckMobileScreen from "../../hooks/useCheckMobileScreen";

export function HowItWorks() {
  return (
    <>
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
    </>
  )
}

export function LimitedTimeOffer() {
  const isMobile = useCheckMobileScreen()
  return (<>
    <Heading
      textAlign={"center"}
      fontSize={isMobile ? "60px" : "8rem"}
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
      bg={isMobile ? "" : "rgba(0, 0, 0,0.7)"}
      borderRadius="30"
      boxShadow={"2xl"}
      padding={isMobile ? 5 : 10}
      pl={isMobile ? "" : 50}
      pr={isMobile ? "" : 50}

    >

      <Container>

        <Heading
          textAlign={"center"}
          borderBottomWidth={5}
          borderBottomColor={"salmon"}
        >Limited Time Offer!
        </Heading>
        <Spacer h={"1rem"} />
        <Text fontSize={isMobile ? 30 : 20}>
          Right now, you can get 1350 impressions a day for just $99 a week per direction!
        </Text>
        <Spacer h={"1rem"} />
        <Text fontSize={isMobile ? 20 : 16}>
          Simply upload your ad below, enter your information and we'll email you with an invoice shortly!
        </Text>
      </Container>
    </Container>
  </>)
}