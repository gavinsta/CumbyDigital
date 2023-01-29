import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, HStack, Input, Link, Spacer, Stack, useDisclosure } from "@chakra-ui/react";

function StickyBottomMenu() {
  return (
    <HStack
      //justifyContent={"center"}
      marginRight={0}
      //alignContent={"end"}
      padding={3}
      //bg={"blackAlpha.500"}
      bottom={0}
      right={0}
      position={"fixed"}
      zIndex="sticky"
    >

      <Link href="mailto:info@cumbydigital.com"
        _hover={{}}
      >
        <Button
          size={"lg"}
          _hover={{

            "backgroundColor": "rgba(255,255,255,0.4)"
          }}
          colorScheme={"fall"}
        >
          More questions?<br />Contact Us!
        </Button>
      </Link>



      {/*
        <Button>
          Book now!
        </Button>
        <Button>
          FAQ
        </Button>*/
      }
    </HStack>
  )
}

const Layout = () => {
  return (
    <Box height={"100vh"}
    >

      <Outlet />
      {<StickyBottomMenu />
      }
      <HStack
        //justifyContent={"center"}
        marginRight={0}
        //alignContent={"end"}
        padding={3}
        //bg={"blackAlpha.500"}
        top={0}
        left={0}
        position={"fixed"}
        zIndex="sticky">
        <Link
          _hover={{

          }}
          textDecorationColor={"white"}
          href="/bookings">
          <Button size={"md"}
            _hover={{

              "backgroundColor": "rgba(255,255,255,0.4)"
            }}
            variant="solid"
            colorScheme="fall">
            Booking Details
          </Button>
        </Link>
        <Link
          _hover={{ "textDecorationColor": "white" }}
          textDecorationColor={"white"}
          href="/home">
          <Button size={"md"}
            _hover={{

              "backgroundColor": "rgba(255,255,255,0.4)"
            }}
            colorScheme={"fall"}>
            Main
          </Button>
        </Link>
      </HStack>
    </Box>
  )
}
export default Layout