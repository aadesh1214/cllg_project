import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { formatDate } from '../../utils/formatters';
import { STATUS_COLORS } from '../../utils/constants';

function AttendanceTable({ records, showEmployee = true }) {
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            {showEmployee && <Th>Employee</Th>}
            {showEmployee && <Th>Employee ID</Th>}
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Marked At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {records.map((record) => (
            <Tr
              key={record._id}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
            >
              {showEmployee && (
                <Td>
                  <Text fontWeight="medium">
                    {record.employee?.fullName || 'Unknown'}
                  </Text>
                </Td>
              )}
              {showEmployee && (
                <Td>
                  <Text fontFamily="mono" fontSize="sm" color="gray.600">
                    {record.employee?.employeeId || '-'}
                  </Text>
                </Td>
              )}
              <Td>
                <Text fontWeight="medium">{formatDate(record.date)}</Text>
              </Td>
              <Td>
                <Badge
                  colorScheme={STATUS_COLORS[record.status]}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {record.status}
                </Badge>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.500">
                  {formatDate(record.createdAt)}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AttendanceTable;
