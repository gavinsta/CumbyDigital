import { Box, Button, Center, Container, Heading, HStack, Image, Input, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import ImageDropzone from "./ImageDropzone";
import * as fs from "fs";
const ASPECT_RATIO = 0.26666666666
const ImageSubmission = ({ setImageBlob }:
  {
    setImageBlob: (imageURI: File | null) => void,
  }) => {

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<"stretched" | "fit">("stretched");
  const { width } = useWindowDimensions();
  const demoWidth = width * 0.8

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
      padding={10}
      bg={"#6a1c00"}
    >
      <Heading textAlign={"center"}
        color={"white"}>
        Preview
      </Heading>
      <Text color={"whiteAlpha.700"}
        textAlign={"center"}>
        View your ad below!
      </Text>
      <Container

        bg="blackAlpha.600"
        borderRadius={15}
        borderWidth={10}
        borderColor={"blackAlpha.800"}
        boxShadow={"2xl"}
        maxWidth={demoWidth * 1.01}
        minW={demoWidth * 1.01}
        minH={demoWidth * 1.01 * ASPECT_RATIO}
        maxHeight={demoWidth * 1.01 * ASPECT_RATIO}
        //objectFit={"contain"}
        justifyContent={"center"}
        display="flex"
        align-items="center"
      >
        {imagePreview ?
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
        }

      </Container>
      {imagePreview ? <HStack
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
        </Button></HStack>
        :
        <></>}
    </Box>

  );
}

export default ImageSubmission