export interface Employee {
  _id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreate {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface EmployeeResponse {
  success: boolean;
  message?: string;
  data?: Employee;
}

export interface EmployeeListResponse {
  success: boolean;
  count: number;
  data: Employee[];
}
