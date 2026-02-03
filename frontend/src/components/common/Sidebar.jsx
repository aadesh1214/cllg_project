import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { FiHome, FiUsers, FiCalendar } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', path: '/', icon: FiHome },
  { name: 'Employees', path: '/employees', icon: FiUsers },
  { name: 'Attendance', path: '/attendance', icon: FiCalendar },
];

function Sidebar() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Box
      as="nav"
      pos="fixed"
      left={0}
      top={0}
      h="100vh"
      w="240px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      display={{ base: 'none', md: 'block' }}
      zIndex={100}
    >
      {/* Logo */}
      <Flex h="64px" alignItems="center" px={6} borderBottom="1px" borderColor={borderColor}>
        <Heading size="md" color="blue.600" fontWeight="bold">
          📋 HRMS Lite
        </Heading>
      </Flex>

      {/* Navigation Items */}
      <VStack spacing={1} align="stretch" p={4}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Flex
                align="center"
                px={4}
                py={3}
                borderRadius="lg"
                cursor="pointer"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : 'gray.600'}
                fontWeight={isActive ? 'semibold' : 'medium'}
                transition="all 0.2s"
                _hover={{
                  bg: isActive ? activeBg : 'gray.100',
                  color: isActive ? activeColor : 'gray.800',
                }}
              >
                <Icon as={item.icon} boxSize={5} mr={3} />
                <Text fontSize="sm">{item.name}</Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>

      {/* Footer */}
      <Box pos="absolute" bottom={0} left={0} right={0} p={4}>
        <Divider mb={4} />
        <Text fontSize="xs" color="gray.500" textAlign="center">
          HRMS Lite v1.0.0
        </Text>
      </Box>
    </Box>
  );
}

export default Sidebar;
