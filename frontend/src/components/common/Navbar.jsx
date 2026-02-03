import { useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  HStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FiMenu, FiHome, FiUsers, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/', icon: FiHome },
  { name: 'Employees', path: '/employees', icon: FiUsers },
  { name: 'Attendance', path: '/attendance', icon: FiCalendar },
];

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
};

function Navbar() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pageTitle = pageTitles[location.pathname] || 'HRMS Lite';

  return (
    <>
      <Box
        as="header"
        pos="sticky"
        top={0}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        zIndex={50}
      >
        <Flex h="64px" alignItems="center" justifyContent="space-between" px={6}>
          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open menu"
            onClick={onOpen}
          />

          {/* Page Title */}
          <Heading size="md" fontWeight="semibold" color="gray.700">
            {pageTitle}
          </Heading>

          {/* Right Side - Admin Avatar */}
          <HStack spacing={4}>
            <Menu>
              <MenuButton>
                <HStack spacing={3} cursor="pointer">
                  <VStack spacing={0} alignItems="flex-end" display={{ base: 'none', sm: 'flex' }}>
                    <Text fontSize="sm" fontWeight="medium">
                      Admin
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Administrator
                    </Text>
                  </VStack>
                  <Avatar size="sm" name="Admin" bg="blue.500" />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={12}>
            <VStack spacing={2} align="stretch">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={onClose}>
                    <Flex
                      align="center"
                      px={4}
                      py={3}
                      borderRadius="lg"
                      bg={isActive ? 'blue.50' : 'transparent'}
                      color={isActive ? 'blue.600' : 'gray.600'}
                      fontWeight={isActive ? 'semibold' : 'medium'}
                    >
                      <Icon as={item.icon} boxSize={5} mr={3} />
                      <Text>{item.name}</Text>
                    </Flex>
                  </Link>
                );
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Navbar;
