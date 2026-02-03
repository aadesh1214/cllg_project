import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import {
  AttendanceCreate,
  AttendanceResponse,
  AttendanceListResponse,
  AttendanceSummaryResponse,
  DashboardResponse
} from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  getAll(startDate?: string, endDate?: string): Observable<AttendanceListResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    
    return this.http.get<AttendanceListResponse>(this.apiUrl, { params });
  }

  getByEmployee(employeeId: string, startDate?: string, endDate?: string): Observable<AttendanceListResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    
    return this.http.get<AttendanceListResponse>(`${this.apiUrl}/employee/${employeeId}`, { params });
  }

  markAttendance(attendance: AttendanceCreate): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(this.apiUrl, attendance);
  }

  getSummary(employeeId: string): Observable<AttendanceSummaryResponse> {
    return this.http.get<AttendanceSummaryResponse>(`${this.apiUrl}/summary/${employeeId}`);
  }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/dashboard`);
  }
}
