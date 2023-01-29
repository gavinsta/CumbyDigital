import express, { Response, Request, Router } from "express"
import path from "path"
import fs from "fs/promises"

const BOOKING_IMAGES_PATH = process.env.BOOKING_IMAGES_PATH;
if (BOOKING_IMAGES_PATH) {
  console.log(`Writing Images to ${BOOKING_IMAGES_PATH}`)
}
else {
  console.error(`No BOOKING_IMAGES_PATH env set!`);
}

const router: Router = express.Router({ mergeParams: true })

router.use(express.static(`${BOOKING_IMAGES_PATH!}`));
router.get('/:id', async (req: Request, res: Response) => {
  const bookingID = req.params.id;
  //console.log(`Finding image: ${bookingID}`)
  const url = await getBookingImagePath(bookingID);
  if (url !== "") {
    const imagePath = path.join(BOOKING_IMAGES_PATH!, url)
    //console.log(`Sending image from: ${imagePath}`);
    res.status(200).sendFile(imagePath);
    //res.status(200).json({ url: url })
  }
  else res.status(404).json();
});

export async function getBookingImagePath(bookingID: string): Promise<string> {
  let path: string = "";
  const files = await getAllBookingImagePaths().catch((error) => {
    console.log(error);
    return [];
  });
  files.forEach((file) => {
    if (file.startsWith(bookingID)) {
      path = file;
      console.log(`Found file at ${path}`);
    }
  });
  if (path !== "") {

  }
  return path;
}


export async function getAllBookingImagePaths(): Promise<string[]> {
  let paths: string[] = []
  paths = await fs.readdir(`${BOOKING_IMAGES_PATH!}/`);
  return paths;
}

export async function saveImageFile(base64Image: string, fileName: string) {
  const buffer = Buffer.from(base64Image.split(",")[1], "base64");
  try {
    await fs.writeFile(BOOKING_IMAGES_PATH + "/" + fileName, buffer, "base64");
    console.log('** File created from base64 encoded string **');
  }
  catch (err) {
    console.log(err);
  }
}

export default router;