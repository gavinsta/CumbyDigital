import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Text, Box, Button, ButtonGroup, HStack, IconButton, Link, Spacer, Stack } from "@chakra-ui/react";
import useCheckMobileScreen from "../hooks/useCheckMobileScreen";
import { AiOutlineMenu } from 'react-icons/ai'
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
      <ContactButton />



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

function ContactButton() {
  return (<Link href="mailto:info@cumbydigital.com"
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
  </Link>)
}
function MainMenu() {

  const isMobile = useCheckMobileScreen()
  const [collapseMenu, setCollapsedMenu] = useState(isMobile ? true : false)
  useEffect(() => {
    if (!isMobile)
      setCollapsedMenu(false)
  }, [isMobile])
  let defaultVersionInfo = {
    client_version: '1.3',
    version: '1.3-local',
    mode: 'local',
  }
  const [versionInfo, setVersionInfo] = useState(defaultVersionInfo)
  useEffect(() => {
    fetch('/api/version').then((res) => res.json()).then((data) => {
      console.log(`VERSION INFORMATION \n CLIENT:${versionInfo.client_version} SERVER: ${data.version} MODE: ${data.mode}`)
      const { version, mode } = data
      if (version && mode) {
        const newInfo = {
          version: version,
          mode: mode,
          client_version: defaultVersionInfo.client_version
        }
        setVersionInfo(newInfo)
      }
    })
  }, [])
  return (<>{collapseMenu ? <IconButton aria-label="Main Menu"
    icon={<AiOutlineMenu />}
    top={2}
    left={2}
    position={"fixed"}
    zIndex="sticky"
    backgroundColor="rgb(180,94,65,0.8)"
    _hover={{
      bg: 'coral'
    }}
    _active={{
      bg: 'coral'
    }}
    onClick={() => {
      setCollapsedMenu(!collapseMenu)
    }}
  /> :
    <ButtonGroup
      color={'white'}
      fontSize={isMobile ? 15 : 25}
      variant={'ghost'}
      backgroundColor={isMobile ? "rgb(180,94,65,0.8)" : "rgb(201,114,85,0.5)"}
      _hover={{
        backgroundColor: "rgb(180,94,65,0.8)"
      }}
      orientation={isMobile ? 'vertical' : 'horizontal'}
      w={'100%'}
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
          "textDecoration": 'underline',
          "textDecorationColor": "white"
        }}
        _active={{
          "textDecoration": 'underline',
          "textDecorationColor": "coral"
        }}
        href="/bookings">
        <Button
          _active={{

          }}
          w={'100%'}
          _hover={{

          }}>
          Booking Details
        </Button>
      </Link>
      <Link

        _hover={{
          "textDecoration": 'underline',
          "textDecorationColor": "white"
        }}
        _active={{
          "textDecoration": 'underline',
          "textDecorationColor": "coral"
        }}
        href="/home">
        <Button
          _active={{}}
          w={"100%"}
          _hover={{


          }}>
          Home
        </Button>
      </Link>

      <Spacer />
      <Link href="mailto:info@cumbydigital.com"
        _hover={{}}
      >
        <Button
          width={'100%'}
          textAlign={'center'}
          _hover={{
            textDecoration: 'underline',
            textDecorationColor: "white"
          }}
          _active={{
            textDecoration: 'underline',
            textDecorationColor: "coral"
          }}
        >
          More questions?<br />Contact Us!
        </Button>
      </Link>
      <Button

        _hover={{
          textDecoration: 'underline',
          textDecorationColor: "white"
        }}
        _active={{
          textDecoration: 'underline',
          textDecorationColor: "coral"
        }}
        onClick={() => {
          setCollapsedMenu(!collapseMenu)
        }}
        leftIcon={<AiOutlineMenu />} variant='ghost'>

        Hide Menu
      </Button>
      <Stack>

        <Text fontSize={10}>
          Version<br />
          {versionInfo.version}<br />

          {versionInfo.mode}
        </Text>
      </Stack>

    </ButtonGroup>}</>)
}
const Layout = () => {
  const isMobile = useCheckMobileScreen()

  return (
    <Box height={"100vh"}
    >

      <Outlet />
      {isMobile ? <></> : <StickyBottomMenu />
      }
      <MainMenu />

    </Box>
  )
}
export default Layout