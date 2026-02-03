export interface EmployeeInfo {
  _id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface Attendance {
  _id: string;
  employee?: EmployeeInfo;
  date: string;
  status: 'Present' | 'Absent';
  created_at: string;
  updated_at: string;
}

export interface AttendanceCreate {
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface AttendanceResponse {
  success: boolean;
  message?: string;
  data?: Attendance;
}

export interface AttendanceListResponse {
  success: boolean;
  count: number;
  data: Attendance[];
}

export interface AttendanceSummary {
  total_days: number;
  present_days: number;
  absent_days: number;
}

export interface AttendanceSummaryResponse {
  success: boolean;
  data: {
    employee: {
      _id: string;
      employee_id: string;
      full_name: string;
    };
    summary: AttendanceSummary;
  };
}

export interface TodayStats {
  date: string;
  present: number;
  absent: number;
  not_marked: number;
}

export interface DepartmentStat {
  _id: string;
  count: number;
}

export interface DashboardData {
  total_employees: number;
  today_stats: TodayStats;
  department_stats: DepartmentStat[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
