import { useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, Input, AlertDialogFooter, ButtonGroup, Link, HStack, Image, useToast, Box, Text, Heading, Select, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { url } from "inspector";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
interface BookingSummary {
  bookingID: string,
  date: Date,
  bookingStatus: "pending" | "confirmed" | "rejected",
  email: string,
  segments: number,
  specialCode?: string,
}
export default function BookingsPage() {
  const [isAdminView, setAdminView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const [bookingID, setBookingID] = useState<string>("");
  const [allBookings, setAllBookings] = useState<BookingSummary[]>([]);
  const [password, setPassword] = useState<string>("");
  const toast = useToast();
  async function findBookings(password: string, bookingID: string) {
    await fetch(`/api/booking/${encodeURIComponent(bookingID)}`, {
      method: "GET",
    })
  }

  async function adminView() {
    const res = await fetch(`/api/booking/admin-view`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        password: password,
      }),
    }).then(validateResponse).then(response => response.json());

    const bookings: BookingSummary[] = res.bookings;
    setAdminView(true);
    if (bookings) {
      console.log(bookings);
      setAllBookings(bookings);
    }
    else {
      toast({
        title: "No bookings recieved!"
      });
      setAllBookings([]);
    }
  }

  async function adminEdit() {
    const res = await fetch('/api/booking/admin-edit', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: password,
        bookings: allBookings,
      }),
    }).then(validateResponse).then(response => response.json())

    if (res.result === "success") {
      setAllBookings(res.bookings)
    }
    toast({
      title: res.title
    });
  }

  async function viewBooking() {
    const res = await fetch(`/api/booking/${bookingID}`,).then(validateResponse)
      .then(response => response.json());

    if (res.bookings) {
      setAllBookings(res.bookings);
    }
  }
  function validateResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        toast({
          variant: "subtle",
          status: "error",
          title: "Incorrect Password",
          position: "top"
        })
      }
      if (response.status === 400) {
        toast({
          variant: "subtle",
          status: "warning",
          title: "Invalid request",
          position: "top"
        })
      }
      throw Error(response.statusText);
    }
    return response;
  }

  function showAllBookings() {
    if (allBookings.length == 0) {
      return <></>
    }
    const array = allBookings.map((x) =>
      <HStack>
        <Heading
          fontSize={20}
          w={100}>
          {x.bookingID}
        </Heading>
        <Button onClick={() => {
          loadImage(x.bookingID);
        }}>
          View Image
        </Button>
        {isAdminView ? <ConfirmationToggle currentStatus={x.bookingStatus} setConfirmationStatus={(value) => {
          x.bookingStatus = value as "pending" | "confirmed" | "rejected";
        }} />
          :
          <Box bg={
            x.bookingStatus === "confirmed" ? "green.500" :
              x.bookingStatus === "rejected" ? "red.500" : "white"}
          >
            <Text>{x.bookingStatus}</Text></Box>}
        <Text>
          {new Date(x.date).toDateString()}
        </Text>
        <Link w={"15%"}
          overflowWrap={"anywhere"}
          href={`mailto:x.email`}>
          Email: {x.email}
        </Link>
        <Text>
          Segments: {x.segments}
        </Text>
        <Text>
          Code: {x.specialCode}
        </Text>
      </HStack>
    );
    return array;
  }
  async function loadImage(bookingID: string) {
    setIsLoading(true);
    await fetch(`/api/images/${bookingID}`)
      .then(validateResponse)
      .then(response => response.blob())
      .then(blob => {
        setImage(URL.createObjectURL(blob));
      })
      .catch((reason) => {
        console.log(reason);
        toast({ status: "warning", title: "Image Unavailable", description: "File may not have been uploaded correctly." })
      });


    setIsLoading(false);
  }
  return (<Box padding={5}
    marginTop={50}>
    <HStack>
      <AdminLogin setPassword={(password: string) => {
        setPassword(password);
      }}
        adminView={adminView} />
      <Input
        value={bookingID}
        onChange={(e) => {
          setBookingID(e.target.value.toUpperCase())
        }}
        placeholder="Booking ID" />
      <Button onClick={async () => {
        await viewBooking();

      }}>
        Find My Booking
      </Button>
    </HStack>
    <Box bg={"blackAlpha.400"} padding={3} >
      {image ?
        <Image maxH={384} maxW={1440} src={image} /> :
        <Text>Image</Text>
      }
    </Box>

    <Box h={"30vh"} overflowY={"scroll"}>
      <Box>
        {showAllBookings()}
      </Box>
    </Box>
    {isAdminView ?
      <HStack>
        <Button colorScheme="blue"
          onClick={async () => {
            allBookings.forEach(console.log);
            await adminEdit();
          }}>
          Save Changes
        </Button>

      </HStack> : <></>}

  </Box>)

}


function AdminLogin({ setPassword, adminView }: { setPassword: (password: string) => void, adminView: () => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return <>
    <>
      <Button colorScheme='blue' variant="ghost" onClick={onOpen}>
        Admin
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Log in
            </AlertDialogHeader>

            <AlertDialogBody>

              <Input placeholder="Password"
                type={"password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }} />
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup variant={"outline"}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='blue' onClick={(e) => {
                  adminView();
                  onClose()
                }} ml={3}>
                  Go
                </Button>

              </ButtonGroup>

            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  </>
}

function ConfirmationToggle({ setConfirmationStatus, currentStatus }: { currentStatus: "pending" | "rejected" | "confirmed", setConfirmationStatus: (value: string) => void }) {
  return (
    <Stack>
      <Text>Status: {currentStatus}</Text>
      <RadioGroup onChange={(nextValue) => {
        setConfirmationStatus(nextValue);
      }}
        defaultChecked={currentStatus !== "pending"}
        defaultValue={currentStatus}>
        <Stack spacing={5} direction='row'>
          <Radio colorScheme='red' value='rejected'>
            <Text padding={2} borderColor="red.500">Reject</Text>
          </Radio>
          <Radio colorScheme='green' value='confirmed'>
            <Text padding={2} borderColor="green.500">Confirm</Text>
          </Radio>
        </Stack>
      </RadioGroup>
    </Stack>)
}