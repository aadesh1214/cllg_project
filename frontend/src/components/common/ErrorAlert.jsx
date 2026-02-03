import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
} from '@chakra-ui/react';

function ErrorAlert({ title = 'Error', message, onClose }) {
  return (
    <Alert status="error" borderRadius="lg" mb={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{title}</AlertTitle>
        {message && <AlertDescription display="block">{message}</AlertDescription>}
      </Box>
      {onClose && (
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={onClose}
        />
      )}
    </Alert>
  );
}

export default ErrorAlert;
