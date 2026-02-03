// Department options for employee form
export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'IT',
  'Legal',
  'Other',
];

// Attendance status options
export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
};

// Attendance status colors for UI
export const STATUS_COLORS = {
  Present: 'green',
  Absent: 'red',
};

// Navigation items
export const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'dashboard',
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: 'people',
  },
  {
    name: 'Attendance',
    path: '/attendance',
    icon: 'calendar',
  },
];
