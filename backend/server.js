const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HRMS Lite API is running...', 
    version: '1.0.0',
    endpoints: {
      employees: '/api/employees',
      attendance: '/api/attendance',
    }
  });
});

// API Routes
app.use('/api/employees', require('./src/routes/employeeRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
  console.log(`📅 Attendance API: http://localhost:${PORT}/api/attendance`);
});
