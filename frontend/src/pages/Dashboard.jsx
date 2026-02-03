import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUsers, FiUserCheck, FiUserX, FiClock } from 'react-icons/fi';
import attendanceApi from '../api/attendanceApi';
import employeeApi from '../api/employeeApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import { formatDate, getTodayDate } from '../utils/formatters';

function StatCard({ icon, label, value, helpText, color }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const iconBg = useColorModeValue(`${color}.50`, `${color}.900`);
  const iconColor = useColorModeValue(`${color}.500`, `${color}.200`);

  return (
    <Card bg={bgColor}>
      <CardBody>
        <HStack spacing={4}>
          <Box p={3} bg={iconBg} borderRadius="lg">
            <Icon as={icon} boxSize={6} color={iconColor} />
          </Box>
          <Stat>
            <StatLabel color="gray.500" fontSize="sm">
              {label}
            </StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
            {helpText && (
              <StatHelpText mb={0} fontSize="xs">
                {helpText}
              </StatHelpText>
            )}
          </Stat>
        </HStack>
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardRes, employeesRes] = await Promise.all([
        attendanceApi.getDashboard(),
        employeeApi.getAll(),
      ]);
      setDashboardData(dashboardRes.data);
      setRecentEmployees(employeesRes.data.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorAlert title="Error loading dashboard" message={error} />;
  }

  const { totalEmployees, todayStats, departmentStats } = dashboardData || {};

  return (
    <VStack spacing={6} align="stretch">
      {/* Welcome Section */}
      <Box>
        <Heading size="lg" mb={1}>
          Welcome to HRMS Lite 👋
        </Heading>
        <Text color="gray.600">
          Here's an overview of your organization for {formatDate(getTodayDate())}
        </Text>
      </Box>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <StatCard
          icon={FiUsers}
          label="Total Employees"
          value={totalEmployees || 0}
          helpText="Active employees"
          color="blue"
        />
        <StatCard
          icon={FiUserCheck}
          label="Present Today"
          value={todayStats?.present || 0}
          helpText={`${todayStats?.date || 'Today'}`}
          color="green"
        />
        <StatCard
          icon={FiUserX}
          label="Absent Today"
          value={todayStats?.absent || 0}
          helpText={`${todayStats?.date || 'Today'}`}
          color="red"
        />
        <StatCard
          icon={FiClock}
          label="Not Marked"
          value={todayStats?.notMarked || 0}
          helpText="Pending attendance"
          color="orange"
        />
      </SimpleGrid>

      {/* Two Column Layout */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Department Distribution */}
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="sm" mb={4}>
              Department Distribution
            </Heading>
            {departmentStats && departmentStats.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Department</Th>
                    <Th isNumeric>Employees</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {departmentStats.map((dept) => (
                    <Tr key={dept._id}>
                      <Td>
                        <Badge colorScheme="blue" variant="subtle">
                          {dept._id}
                        </Badge>
                      </Td>
                      <Td isNumeric fontWeight="medium">
                        {dept.count}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500" fontSize="sm">
                No department data available
              </Text>
            )}
          </CardBody>
        </Card>

        {/* Recent Employees */}
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="sm" mb={4}>
              Recent Employees
            </Heading>
            {recentEmployees && recentEmployees.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Department</Th>
                    <Th>Joined</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentEmployees.map((emp) => (
                    <Tr key={emp._id}>
                      <Td>
                        <Text fontWeight="medium" fontSize="sm">
                          {emp.fullName}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {emp.department}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.500">
                          {formatDate(emp.createdAt)}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500" fontSize="sm">
                No employees yet
              </Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
}

export default Dashboard;
