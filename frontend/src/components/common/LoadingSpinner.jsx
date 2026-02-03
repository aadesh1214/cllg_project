import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Flex justify="center" align="center" minH="200px" w="100%">
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.500" fontSize="sm">
          {message}
        </Text>
      </VStack>
    </Flex>
  );
}

export default LoadingSpinner;
