import { Box, Button, ButtonGroup, Center, Container, Heading, HStack, Image, Input, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import ImageDropzone from "./ImageDropzone";
import * as fs from "fs";
import useCheckMobileScreen from "../hooks/useCheckMobileScreen";
const ASPECT_RATIO = 0.26666666666
const ImageSubmission = ({ setImageBlob }:
  {
    setImageBlob: (imageURI: File | null) => void,
  }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<"stretched" | "fit">("stretched");
  const { width, height } = useWindowDimensions();
  const isMobile = useCheckMobileScreen();
  const demoWidth = isMobile ? width * 1.4 : width * 0.8
  /**Used for mobile viewing */
  const demoHeight = height * 0.6
  function getImageStyle() {
    if (imageStyle == "stretched") {
      return {
        width: demoWidth,
        height: demoWidth * ASPECT_RATIO,
      }
    }
    else return {
      maxHeight: demoWidth * ASPECT_RATIO,
      maxWidth: demoWidth
    }

  }

  return (
    <Box
      justifyContent={'center'}
      padding={isMobile ? 0 : 10}
      pt={isMobile ? 20 : ''}
      pb={isMobile ? 20 : ''}
      h={isMobile ? "100%" : ""}
      bg="whiteAlpha.500"
      bgAttachment={isMobile ? 'fixed' : ""}
      bgImage="linear-gradient(rgba(0.5, 0.5, 0.5, 0.6),rgba(0.5,0.5,0.5,0.3)), url('photos/fireworks.jpg')"
    //bg={"#6a1c00"}
    >

      <Box minH={isMobile ? demoWidth * 1.3 : demoWidth * ASPECT_RATIO}>

        <Heading textAlign={"center"}
          color={"white"}>
          Image upload
        </Heading>
        <Text color={"whiteAlpha.700"}
          textAlign={"center"}>
          Upload your ad, and preview how it'll look on the Billboard! {isMobile ? "(Rotate your phone)" : ''}
        </Text>
        <Container
          style={isMobile ? { transform: 'rotate(90deg) translate(15em,5em)' } : {}}
          bg="blackAlpha.600"
          borderRadius={15}
          borderWidth={10}
          borderColor={"blackAlpha.800"}
          boxShadow={"2xl"}
          maxWidth={demoWidth * 1.01}
          minW={demoWidth * 1.01}
          minH={demoWidth * ASPECT_RATIO * 1.01}
          maxHeight={demoWidth * ASPECT_RATIO * 1.01}
          //objectFit={"contain"}
          justifyContent={"center"}
          display="flex"
          align-items="center"
        >
          {isMobile ?
            <>
              {imagePreview ?
                <Image

                  padding={2}
                  alignSelf={"center"}
                  style={getImageStyle()}
                  src={imagePreview}
                />
                : <Text color="white">This side up</Text>}
            </> : <>{imagePreview ?
              <Image
                padding={2}
                alignSelf={"center"}
                style={getImageStyle()}
                src={imagePreview}
              />
              :
              <Box
                alignSelf={"center"}
                display={"flex"}
                justifyContent={"center"}>
                <ImageDropzone onFileAccepted={(file: File) => {
                  setImageBlob(file);
                  setImagePreview(URL.createObjectURL(file));
                  console.log(URL.createObjectURL(file));
                }} />
              </Box>
            }</>}
        </Container>
      </Box>

      {imagePreview ? <Center>
        <ButtonGroup variant={'solid'} w={'100%'}
          pl={isMobile ? 50 : 0}
          orientation={isMobile ? "vertical" : "horizontal"}
          //display={"flex"}
          width={"100%"}
          justifyContent={"center"}
        >  <Button
          width={"50%"}
          colorScheme={"fall"}
          onClick={() => {
            if (imageStyle == "fit") {
              setImageStyle("stretched")
            }
            else if (imageStyle == "stretched") {
              setImageStyle("fit")
            }
          }
          }
        >
            Format: {imageStyle}
          </Button>

          <Button
            width={"50%"}
            colorScheme={"red"}

            onClick={() => {
              setImageBlob(null)
              setImagePreview(null)
            }}
          >
            Clear
          </Button></ButtonGroup></Center>
        :
        <></>}
      {isMobile ?
        <Box
          alignSelf={"center"}
          display={"flex"}
          justifyContent={"center"}>
          <ImageDropzone onFileAccepted={(file: File) => {
            setImageBlob(file);
            setImagePreview(URL.createObjectURL(file));
            console.log(URL.createObjectURL(file));
          }} />
        </Box> : <></>}
    </Box>
  );
}

export default ImageSubmission