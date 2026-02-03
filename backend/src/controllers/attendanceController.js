const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Public
const getAllAttendance = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;

    // Build query filter
    let filter = {};

    // Filter by specific date
    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: queryDate,
        $lt: nextDay,
      };
    }

    // Filter by date range
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'employeeId fullName email department')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message,
    });
  }
};

// @desc    Get attendance for specific employee
// @route   GET /api/attendance/employee/:employeeId
// @access  Public
const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Build query filter
    let filter = { employee: employeeId };

    // Filter by date range if provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(filter)
      .populate('employee', 'employeeId fullName email department')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee attendance',
      error: error.message,
    });
  }
};

// @desc    Mark attendance for an employee
// @route   POST /api/attendance
// @access  Public
const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    // Validate required fields
    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: employeeId, date, status',
      });
    }

    // Validate status
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Present" or "Absent"',
      });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Parse and normalize the date to start of day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check for existing attendance on the same date
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      await existingAttendance.save();

      const updatedAttendance = await Attendance.findById(existingAttendance._id)
        .populate('employee', 'employeeId fullName email department');

      return res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: updatedAttendance,
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      employee: employeeId,
      date: attendanceDate,
      status,
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('employee', 'employeeId fullName email department');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: populatedAttendance,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message,
    });
  }
};

// @desc    Get attendance summary for an employee (bonus feature)
// @route   GET /api/attendance/summary/:employeeId
// @access  Public
const getAttendanceSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Get summary using the static method
    const summary = await Attendance.getEmployeeSummary(employeeId);

    res.status(200).json({
      success: true,
      data: {
        employee: {
          _id: employee._id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
        },
        summary,
      },
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance summary',
      error: error.message,
    });
  }
};

// @desc    Get dashboard summary (bonus feature)
// @route   GET /api/attendance/dashboard
// @access  Public
const getDashboardSummary = async (req, res) => {
  try {
    // Get total employees
    const totalEmployees = await Employee.countDocuments();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;
    const absentToday = todayAttendance.filter((a) => a.status === 'Absent').length;

    // Get department-wise employee count
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        todayStats: {
          date: today.toISOString().split('T')[0],
          present: presentToday,
          absent: absentToday,
          notMarked: totalEmployees - presentToday - absentToday,
        },
        departmentStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAttendance,
  getEmployeeAttendance,
  markAttendance,
  getAttendanceSummary,
  getDashboardSummary,
};
