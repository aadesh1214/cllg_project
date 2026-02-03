const express = require('express');
const router = express.Router();

const {
  getAllAttendance,
  getEmployeeAttendance,
  markAttendance,
  getAttendanceSummary,
  getDashboardSummary,
} = require('../controllers/attendanceController');

// @route   GET /api/attendance/dashboard
// @desc    Get dashboard summary (bonus feature)
router.get('/dashboard', getDashboardSummary);

// @route   GET /api/attendance/summary/:employeeId
// @desc    Get attendance summary for an employee (bonus feature)
router.get('/summary/:employeeId', getAttendanceSummary);

// @route   GET /api/attendance/employee/:employeeId
// @desc    Get attendance records for a specific employee
router.get('/employee/:employeeId', getEmployeeAttendance);

// @route   GET /api/attendance
// @desc    Get all attendance records (with optional date filter)
router.get('/', getAllAttendance);

// @route   POST /api/attendance
// @desc    Mark attendance for an employee
router.post('/', markAttendance);

module.exports = router;
