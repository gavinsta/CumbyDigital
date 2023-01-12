import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import FormData from 'form-data';
import CardSection from '../styled_components/CardSection';
import { Alert, Box, Button, Center, Container, Heading, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import OrderSummary from '../styled_components/OrderSummary';
import { Booking, Order } from '../../types/Booking';
import fs from 'fs'
import { convertToBase64 } from '../../utils/misc';
import { Navigate } from 'react-router-dom';
export default function CheckoutForm({ upload, bookings }: { upload: File | null, bookings: Booking[] }) {
  const defaultFormFields = {
    email: '',
    firstName: '',
    lastName: '',
    businessName: '',
  }
  const [isThrottled, setThrottled] = useState<boolean>(false);
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  const [formFields, setFormFields] = useState(defaultFormFields)
  const [alertText, setAlertText] = useState<string>();
  const [orderStage, setOrderStage] = useState<"checkout" | "loading" | "complete">("checkout");
  const [bookingID, setBookingID] = useState<string>("")
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (secondsWaiting > 0) {
        setSecondsWaiting(secondsWaiting - 1);
      }
      if (secondsWaiting === 0) {
        clearInterval(myInterval)
        setThrottled(false)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormFields({ ...formFields, [name]: value })
  }

  function checkoutError(errorText: string) {
    setOrderStage("checkout");
    setAlertText(errorText);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) {

      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      setAlertText("Connecting to server.");
      return;
    }
    if (!upload) {
      setAlertText("Please select an ad!");
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      setAlertText("Please include credit card information to register as a new customer.")
      return;
    }


    setOrderStage("loading");
    const tokenResult = await stripe.createToken(card);

    if (tokenResult.error) {
      // Show error to your customer.
      console.log(tokenResult.error.message);
      checkoutError("Problem processing card");
      return;
    }

    setThrottled(true)
    setSecondsWaiting(5)
    let imageStream;
    if (upload) {
      imageStream = await convertToBase64(upload);
    }
    try {
      const result = await fetch(`/api/new_order`, {
        method: "POST",
        // enctype:"multipart/form-data",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          //bookingSegments: bookings,
          customerDetails: formFields,
          image64: imageStream,
          stripeToken: tokenResult.token.id,
          //blank for now
          orderSummary: {}
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.result === "success") {
            setOrderStage("complete");
            setBookingID(data.bookingID);
          }
        }
        )
    }
    catch (err) {
      console.log(err)
      checkoutError("Error during checkout")
    }
  }
  return (
    <Container
      background={"whiteAlpha.900"}
      boxShadow={"2xl"}
      padding={5}
      maxW={"600px"}
    >
      <Stack spacing={10}>
        {orderStage == "loading" ?
          <LoadingScreen /> : <></>}
        {orderStage == "complete" ? <CheckoutComplete bookingID={bookingID} /> : <></>}
        {alertText ?
          <Alert status='error'
          >
            {alertText}
          </Alert> : <></>}
        <form onSubmit={handleSubmit}>
          <OrderSummary bookings={bookings} />
          <HStack>
            <Input
              required={true}
              name='firstName'
              placeholder='First Name'
              onChange={handleChange}
            /> <Input
              required={true}
              name='lastName'
              placeholder='Last Name'
              onChange={handleChange}
            />
          </HStack>
          <Input
            required={true}
            name='email'
            type="email"
            placeholder='Email'
            onChange={handleChange}
          />
          <Input
            required={true}
            name='businessName'
            placeholder='Your business (optional)'
            onChange={handleChange}
          />
          <CardSection />
          <Center>
            <Button
              colorScheme={"blue"}
              type="submit"
              disabled={!stripe || orderStage != "checkout"}>Sign me up!</Button>
          </Center>

        </form>
      </Stack>


    </Container>
  );
}

const LoadingScreen = function (
) {
  return (<Container>
    <Spinner
      thickness='6px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />
    <Stack>
      <Text>Your order is underway.</Text>
      <Text>Please don't leave this page</Text>
    </Stack>

  </Container>)
}

const CheckoutComplete = ({ bookingID }:
  { bookingID: string }) => {
  return (<Stack>
    <Heading>Thank you for registering!</Heading>
    <HStack>
      <Text>Your booking code is: </Text>
      <Text fontSize={24} fontWeight={"black"}>{bookingID}</Text>
    </HStack>

    <Text>Check your email for confirmation of your ad.</Text>
  </Stack>

  )
}

