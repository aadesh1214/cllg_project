import axiosInstance from './axiosInstance';

const employeeApi = {
  // Get all employees
  getAll: async () => {
    const response = await axiosInstance.get('/api/employees');
    return response.data;
  },

  // Get single employee by ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/api/employees/${id}`);
    return response.data;
  },

  // Create new employee
  create: async (employeeData) => {
    const response = await axiosInstance.post('/api/employees', employeeData);
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await axiosInstance.delete(`/api/employees/${id}`);
    return response.data;
  },
};

export default employeeApi;
