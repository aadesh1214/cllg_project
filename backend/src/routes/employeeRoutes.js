const express = require('express');
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// @route   GET /api/employees
// @desc    Get all employees
router.get('/', getAllEmployees);

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
router.get('/:id', getEmployeeById);

// @route   POST /api/employees
// @desc    Create a new employee
router.post('/', createEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
router.delete('/:id', deleteEmployee);

module.exports = router;
