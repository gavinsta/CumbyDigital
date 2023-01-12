import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: `'Bebas Neue', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  colors: {
    brand: {
      bg: "F7EDE2",
      highlight: "F6BD60",
      primary: "F28482",
      secondary: "F5CAC3",
      contrast: "84A59D",

    },
    base:
    {
      50: '#f9f3eb',
      100: '#ebdbc8',
      200: '#dfc2a3',
      300: '#d4a97c',
      400: '#c99155',
      500: '#b0783d',
      600: '#885d30',
      700: '#614223',
      800: '#3a2815',
      900: '#140d06',
    },
    fall:
    {
      50: '#f9f3eb',
      100: '#ebd8c8',
      200: '#dfbaa3',
      300: '#d4987c',
      400: '#c97255',
      500: '#b0513d',
      600: '#883a30',
      700: '#612523',
      800: '#3a1516',
      900: '#140607',
    },

    cgreen: {
      50: '#e8f7eb',
      100: '#cde2d0',
      200: '#b0ceb2',
      300: '#91ba95',
      400: '#73a678',
      500: '#5a8d5f',
      600: '#456e49',
      700: '#304e33',
      800: '#1c301d',
      900: '#031203',
    }
  }
})

export default theme