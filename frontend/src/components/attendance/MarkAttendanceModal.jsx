import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  Box,
} from '@chakra-ui/react';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import { getTodayDate } from '../../utils/formatters';
import attendanceApi from '../../api/attendanceApi';

function MarkAttendanceModal({ isOpen, onClose, onSuccess, employees, selectedEmployee }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: getTodayDate(),
    status: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Set selected employee when modal opens
  useEffect(() => {
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedEmployee._id,
      }));
    }
  }, [selectedEmployee, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.status) {
      newErrors.status = 'Please select attendance status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await attendanceApi.mark(formData);
      
      const employee = employees.find((emp) => emp._id === formData.employeeId);
      toast({
        title: 'Attendance marked',
        description: `Attendance for ${employee?.fullName || 'employee'} has been recorded.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      toast({
        title: 'Error marking attendance',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employeeId: '',
      date: getTodayDate(),
      status: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Mark Attendance</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.employeeId}>
                <FormLabel>Employee</FormLabel>
                <Select
                  name="employeeId"
                  placeholder="Select employee"
                  value={formData.employeeId}
                  onChange={handleChange}
                >
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.fullName} ({emp.employeeId})
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.employeeId}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.date}>
                <FormLabel>Date</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
                <FormErrorMessage>{errors.date}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  placeholder="Select status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value={ATTENDANCE_STATUS.PRESENT}>
                    ✅ Present
                  </option>
                  <option value={ATTENDANCE_STATUS.ABSENT}>
                    ❌ Absent
                  </option>
                </Select>
                <FormErrorMessage>{errors.status}</FormErrorMessage>
              </FormControl>

              <Box
                w="100%"
                p={3}
                bg="blue.50"
                borderRadius="md"
                fontSize="sm"
                color="blue.700"
              >
                <Text>
                  💡 If attendance already exists for this employee on the selected date, it will be updated.
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Mark Attendance
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default MarkAttendanceModal;
