import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import {
  Employee,
  EmployeeCreate,
  EmployeeResponse,
  EmployeeListResponse
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/api/employees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeeListResponse> {
    return this.http.get<EmployeeListResponse>(this.apiUrl);
  }

  getById(id: string): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.apiUrl}/${id}`);
  }

  create(employee: EmployeeCreate): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.apiUrl, employee);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
