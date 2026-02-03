import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import employeeApi from '../api/employeeApi';
import EmployeeList from '../components/employees/EmployeeList';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import DeleteConfirmModal from '../components/employees/DeleteConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(query) ||
          emp.employeeId.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      await employeeApi.delete(selectedEmployee._id);
      toast({
        title: 'Employee deleted',
        description: `${selectedEmployee.fullName} has been removed.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchEmployees();
      onDeleteClose();
    } catch (err) {
      toast({
        title: 'Error deleting employee',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      setSelectedEmployee(null);
    }
  };

  const handleViewAttendance = (employee) => {
    // Navigate to attendance page with employee filter
    navigate(`/attendance?employee=${employee._id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Box>
          <Heading size="lg">Employees</Heading>
          <Text color="gray.600" mt={1}>
            Manage your organization's employees
          </Text>
        </Box>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onAddOpen}>
          Add Employee
        </Button>
      </Flex>

      {/* Search Bar */}
      <Box mb={4}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name, ID, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
          />
        </InputGroup>
      </Box>

      {/* Error State */}
      {error && <ErrorAlert title="Error" message={error} onClose={() => setError(null)} />}

      {/* Content */}
      <Card bg={cardBg}>
        <CardBody p={0}>
          {isLoading ? (
            <LoadingSpinner message="Loading employees..." />
          ) : filteredEmployees.length === 0 ? (
            <EmptyState
              icon="employees"
              title={searchQuery ? 'No matching employees' : 'No employees yet'}
              description={
                searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first employee'
              }
              actionLabel={!searchQuery ? 'Add Employee' : undefined}
              onAction={!searchQuery ? onAddOpen : undefined}
            />
          ) : (
            <EmployeeList
              employees={filteredEmployees}
              onDelete={handleDeleteClick}
              onViewAttendance={handleViewAttendance}
            />
          )}
        </CardBody>
      </Card>

      {/* Results count */}
      {!isLoading && filteredEmployees.length > 0 && (
        <Text fontSize="sm" color="gray.500" mt={3}>
          Showing {filteredEmployees.length} of {employees.length} employees
        </Text>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSuccess={fetchEmployees}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        employee={selectedEmployee}
        isLoading={isDeleting}
      />
    </Box>
  );
}

export default Employees;
