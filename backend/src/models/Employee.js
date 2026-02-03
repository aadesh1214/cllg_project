const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Engineering',
          'Human Resources',
          'Finance',
          'Marketing',
          'Sales',
          'Operations',
          'IT',
          'Legal',
          'Other',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
employeeSchema.index({ email: 1 });
employeeSchema.index({ department: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
