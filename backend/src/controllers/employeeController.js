const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message,
    });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Public
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message,
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Public
const createEmployee = async (req, res) => {
  try {
    const { employeeId, fullName, email, department } = req.body;

    // Check for required fields
    if (!employeeId || !fullName || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: employeeId, fullName, email, department',
      });
    }

    // Check for duplicate employeeId
    const existingEmployeeId = await Employee.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingEmployeeId) {
      return res.status(409).json({
        success: false,
        message: `Employee with ID "${employeeId}" already exists`,
      });
    }

    // Check for duplicate email
    const existingEmail = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Employee with email "${email}" already exists`,
      });
    }

    // Create employee
    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      department,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `An employee with this ${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message,
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Public
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Delete all attendance records for this employee
    await Attendance.deleteMany({ employee: req.params.id });

    // Delete the employee
    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Employee and associated attendance records deleted successfully',
      data: {},
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
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
};
