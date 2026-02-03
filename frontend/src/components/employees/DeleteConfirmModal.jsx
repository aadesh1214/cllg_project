import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Icon,
  Box,
} from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, employee, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} py={4}>
            <Box p={3} bg="red.50" borderRadius="full">
              <Icon as={FiAlertTriangle} boxSize={8} color="red.500" />
            </Box>
            <VStack spacing={2} textAlign="center">
              <Text fontWeight="medium">
                Are you sure you want to delete this employee?
              </Text>
              {employee && (
                <Text color="gray.600" fontSize="sm">
                  <strong>{employee.fullName}</strong> ({employee.employeeId})
                </Text>
              )}
              <Text color="red.500" fontSize="sm">
                This action cannot be undone. All attendance records for this employee will also be deleted.
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteConfirmModal;
