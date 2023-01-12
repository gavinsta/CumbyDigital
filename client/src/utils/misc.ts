/*
export function base64_encode(file: File) {
  // read binary data
  var bitmap = fs.readFileSync(URL.createObjectURL(file), { encoding: "base64" });
  // convert binary data to base64 encoded string
  return bitmap
};
*/
export const convertToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};