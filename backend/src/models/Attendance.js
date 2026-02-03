const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      required: [true, 'Attendance status is required'],
      enum: {
        values: ['Present', 'Absent'],
        message: '{VALUE} is not a valid status. Use "Present" or "Absent"',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Index for date-based queries
attendanceSchema.index({ date: 1 });

// Static method to get attendance summary for an employee
attendanceSchema.statics.getEmployeeSummary = async function (employeeId) {
  const summary = await this.aggregate([
    {
      $match: { employee: new mongoose.Types.ObjectId(employeeId) },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
  };

  summary.forEach((item) => {
    if (item._id === 'Present') {
      result.presentDays = item.count;
    } else if (item._id === 'Absent') {
      result.absentDays = item.count;
    }
    result.totalDays += item.count;
  });

  return result;
};

module.exports = mongoose.model('Attendance', attendanceSchema);
