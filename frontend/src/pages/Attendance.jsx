import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  useDisclosure,
  useColorModeValue,
  Select,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import attendanceApi from '../api/attendanceApi';
import employeeApi from '../api/employeeApi';
import AttendanceTable from '../components/attendance/AttendanceTable';
import AttendanceFilter from '../components/attendance/AttendanceFilter';
import MarkAttendanceModal from '../components/attendance/MarkAttendanceModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';

function Attendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(searchParams.get('employee') || '');
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch attendance when filters change
  useEffect(() => {
    fetchAttendance();
  }, [selectedEmployeeId, filters]);

  // Fetch employee summary when selected employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchEmployeeSummary(selectedEmployeeId);
    } else {
      setEmployeeSummary(null);
    }
  }, [selectedEmployeeId]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchAttendance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      const params = {};
      
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      if (selectedEmployeeId) {
        response = await attendanceApi.getByEmployee(selectedEmployeeId, params);
      } else {
        response = await attendanceApi.getAll(params);
      }
      setAttendance(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeSummary = async (employeeId) => {
    try {
      const response = await attendanceApi.getSummary(employeeId);
      setEmployeeSummary(response.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  const handleEmployeeChange = (e) => {
    const value = e.target.value;
    setSelectedEmployeeId(value);
    if (value) {
      setSearchParams({ employee: value });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
  };

  const selectedEmployee = employees.find((emp) => emp._id === selectedEmployeeId);

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Box>
          <Heading size="lg">Attendance</Heading>
          <Text color="gray.600" mt={1}>
            Track and manage employee attendance
          </Text>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={onOpen}
          isDisabled={employees.length === 0}
        >
          Mark Attendance
        </Button>
      </Flex>

      {/* Employee Selector */}
      <Card bg={cardBg} mb={4}>
        <CardBody>
          <HStack spacing={4} flexWrap="wrap">
            <Box minW="250px">
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Filter by Employee
              </Text>
              <Select
                placeholder="All Employees"
                value={selectedEmployeeId}
                onChange={handleEmployeeChange}
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName} ({emp.employeeId})
                  </option>
                ))}
              </Select>
            </Box>

            {/* Employee Summary (bonus feature) */}
            {employeeSummary && (
              <HStack spacing={4} ml="auto">
                <Badge colorScheme="blue" p={2} borderRadius="md">
                  Total Days: {employeeSummary.summary.totalDays}
                </Badge>
                <Badge colorScheme="green" p={2} borderRadius="md">
                  Present: {employeeSummary.summary.presentDays}
                </Badge>
                <Badge colorScheme="red" p={2} borderRadius="md">
                  Absent: {employeeSummary.summary.absentDays}
                </Badge>
              </HStack>
            )}
          </HStack>
        </CardBody>
      </Card>

      {/* Date Filters (bonus feature) */}
      <AttendanceFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
      />

      {/* Error State */}
      {error && <ErrorAlert title="Error" message={error} onClose={() => setError(null)} />}

      {/* Content */}
      <Card bg={cardBg}>
        <CardBody p={0}>
          {isLoading ? (
            <LoadingSpinner message="Loading attendance records..." />
          ) : attendance.length === 0 ? (
            <EmptyState
              icon="attendance"
              title="No attendance records"
              description={
                selectedEmployeeId
                  ? 'No attendance records found for this employee'
                  : 'Start by marking attendance for employees'
              }
              actionLabel="Mark Attendance"
              onAction={employees.length > 0 ? onOpen : undefined}
            />
          ) : (
            <AttendanceTable
              records={attendance}
              showEmployee={!selectedEmployeeId}
            />
          )}
        </CardBody>
      </Card>

      {/* Results count */}
      {!isLoading && attendance.length > 0 && (
        <Text fontSize="sm" color="gray.500" mt={3}>
          Showing {attendance.length} records
          {selectedEmployee && ` for ${selectedEmployee.fullName}`}
        </Text>
      )}

      {/* Mark Attendance Modal */}
      <MarkAttendanceModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={fetchAttendance}
        employees={employees}
        selectedEmployee={selectedEmployee}
      />
    </Box>
  );
}

export default Attendance;
