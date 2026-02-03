import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box flex="1" ml={{ base: 0, md: '240px' }}>
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <Box as="main" p={6} minH="calc(100vh - 64px)">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </Box>
      </Box>
    </Flex>
  );
}

export default App;
