import { useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Center, useColorModeValue, Icon, Text, Stack } from '@chakra-ui/react';
import { AiFillFileAdd } from 'react-icons/ai';

export default function ImageDropzone({ onFileAccepted }:
  { onFileAccepted: (file: File) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileAccepted(acceptedFiles[0]);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxFiles: 1, multiple: false,
  });

  const dropText = isDragActive ? 'Drop the files here ...' : 'Drag PNG or JPEG images here, or click to select files';

  const activeBg = useColorModeValue('whiteAlpha.300', 'blackAlpha.600');
  const borderColor = useColorModeValue(
    isDragActive ? 'teal.300' : 'gray.300',
    isDragActive ? 'teal.500' : 'gray.500',
  );

  return (
    <Center
      h={"80%"}
      color={"white"}
      p={10}
      cursor="pointer"
      bg={isDragActive ? activeBg : 'transparent'}
      _hover={{
        bg: activeBg,
        color: "coral"
      }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon as={AiFillFileAdd} mr={2} fontSize={"3rem"} />
      <Stack>
        <Text>{dropText}</Text>
        <Text>Maximum file size: 10MB</Text>
      </Stack>

    </Center>
  );
}