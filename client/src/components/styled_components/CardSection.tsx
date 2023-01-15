import React from 'react';
import { Box, Container, HStack, Icon, IconButton, Link, Spacer, Text } from '@chakra-ui/react';
import { CardElement } from '@stripe/react-stripe-js';
import { FaStripe } from 'react-icons/fa'
//import './Styles.css'
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
function CardSection() {
  return (
    <Box
    >
      Credit Card Details:
      <Box
        padding={5}
        borderWidth={5}>


        <CardElement
          options={CARD_ELEMENT_OPTIONS} />
      </Box>
      <Text>Please note, your card will <b>not</b> be charged until we confirm your order!</Text>
      <Spacer h={"15px"} />
      <Link

        href='https://stripe.com/en-ca' isExternal color={"gray.400"}>
        <HStack>
          <Text>Powered by</Text> <Icon aria-label={"stripe link"} fontSize={60} as={FaStripe} />
        </HStack>
      </Link>

    </Box>
  );
};
export default CardSection;