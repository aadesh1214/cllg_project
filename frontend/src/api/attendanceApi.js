import axiosInstance from './axiosInstance';

const attendanceApi = {
  // Get all attendance records
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/api/attendance', { params });
    return response.data;
  },

  // Get attendance for specific employee
  getByEmployee: async (employeeId, params = {}) => {
    const response = await axiosInstance.get(`/api/attendance/employee/${employeeId}`, { params });
    return response.data;
  },

  // Mark attendance
  mark: async (attendanceData) => {
    const response = await axiosInstance.post('/api/attendance', attendanceData);
    return response.data;
  },

  // Get attendance summary for an employee
  getSummary: async (employeeId) => {
    const response = await axiosInstance.get(`/api/attendance/summary/${employeeId}`);
    return response.data;
  },

  // Get dashboard summary
  getDashboard: async () => {
    const response = await axiosInstance.get('/api/attendance/dashboard');
    return response.data;
  },
};

export default attendanceApi;
