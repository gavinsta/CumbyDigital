import { Outlet } from "react-router-dom";
import React from "react";
import { Box, Button, ButtonGroup, HStack, Link, Spacer } from "@chakra-ui/react";

function NavMenu() {
  return (
    <Box
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
      <Link href="mailto:info@cumbydigital.com">
        <Button
          size={"lg"}
          colorScheme={"fall"}
        >
          More questions? Contact Us!
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

      <Spacer />
    </Box>
  )
}
const Layout = () => {
  return (
    <Box height={"100vh"}
    >
      {<NavMenu />
      }
      <Outlet />
    </Box>
  )
}
export default Layout