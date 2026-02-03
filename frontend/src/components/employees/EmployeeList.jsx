import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  Text,
  Box,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { FiTrash2, FiCalendar } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

function EmployeeList({ employees, onDelete, onViewAttendance }) {
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Department badge colors
  const getDepartmentColor = (department) => {
    const colors = {
      Engineering: 'blue',
      'Human Resources': 'purple',
      Finance: 'green',
      Marketing: 'orange',
      Sales: 'cyan',
      Operations: 'yellow',
      IT: 'teal',
      Legal: 'red',
      Other: 'gray',
    };
    return colors[department] || 'gray';
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Employee ID</Th>
            <Th>Full Name</Th>
            <Th>Email</Th>
            <Th>Department</Th>
            <Th>Joined</Th>
            <Th textAlign="right">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.map((employee) => (
            <Tr
              key={employee._id}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
            >
              <Td>
                <Text fontWeight="medium" fontFamily="mono">
                  {employee.employeeId}
                </Text>
              </Td>
              <Td>
                <Text fontWeight="medium">{employee.fullName}</Text>
              </Td>
              <Td>
                <Text color="gray.600" fontSize="sm">
                  {employee.email}
                </Text>
              </Td>
              <Td>
                <Badge colorScheme={getDepartmentColor(employee.department)} borderRadius="full" px={2}>
                  {employee.department}
                </Badge>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.500">
                  {formatDate(employee.createdAt)}
                </Text>
              </Td>
              <Td>
                <HStack spacing={2} justify="flex-end">
                  <Tooltip label="View Attendance" placement="top">
                    <IconButton
                      icon={<FiCalendar />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      aria-label="View attendance"
                      onClick={() => onViewAttendance(employee)}
                    />
                  </Tooltip>
                  <Tooltip label="Delete Employee" placement="top">
                    <IconButton
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Delete employee"
                      onClick={() => onDelete(employee)}
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default EmployeeList;
