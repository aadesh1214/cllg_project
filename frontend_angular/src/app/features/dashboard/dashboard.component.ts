import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AttendanceService } from '@app/core/services/attendance.service';
import { EmployeeService } from '@app/core/services/employee.service';
import { DashboardStats, DepartmentDistribution } from '@app/core/models/attendance.model';
import { Employee } from '@app/core/models/employee.model';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="dashboard">
      @if (isLoading) {
        <app-loading-spinner message="Loading dashboard..."></app-loading-spinner>
      } @else {
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <span class="material-icons">people</span>
            </div>
            <div class="stat-content">
              <h3>{{ stats?.totalEmployees || 0 }}</h3>
              <p>Total Employees</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon green">
              <span class="material-icons">check_circle</span>
            </div>
            <div class="stat-content">
              <h3>{{ stats?.presentToday || 0 }}</h3>
              <p>Present Today</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon red">
              <span class="material-icons">cancel</span>
            </div>
            <div class="stat-content">
              <h3>{{ stats?.absentToday || 0 }}</h3>
              <p>Absent Today</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon purple">
              <span class="material-icons">business</span>
            </div>
            <div class="stat-content">
              <h3>{{ stats?.departments?.length || 0 }}</h3>
              <p>Departments</p>
            </div>
          </div>
        </div>

        <!-- Department Distribution -->
        <div class="section">
          <div class="section-header">
            <h2>Department Distribution</h2>
          </div>
          <div class="department-grid">
            @for (dept of stats?.departments; track dept.name) {
              <div class="dept-card">
                <div class="dept-header">
                  <span class="dept-name">{{ dept.name }}</span>
                  <span class="dept-count">{{ dept.count }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="getDeptPercentage(dept.count)"></div>
                </div>
              </div>
            } @empty {
              <p class="no-data">No departments found</p>
            }
          </div>
        </div>

        <!-- Recent Employees -->
        <div class="section">
          <div class="section-header">
            <h2>Recent Employees</h2>
            <a routerLink="/employees" class="view-all">View All →</a>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                @for (employee of recentEmployees; track employee.id) {
                  <tr>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.email }}</td>
                    <td><span class="badge">{{ employee.department }}</span></td>
                    <td>{{ employee.joiningDate | date:'mediumDate' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="no-data">No employees found</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1.5rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-icon.blue { background: #dbeafe; color: #2563eb; }
    .stat-icon.green { background: #dcfce7; color: #16a34a; }
    .stat-icon.red { background: #fee2e2; color: #dc2626; }
    .stat-icon.purple { background: #f3e8ff; color: #9333ea; }
    
    .stat-icon .material-icons {
      font-size: 1.75rem;
    }
    
    .stat-content h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--gray-800);
    }
    
    .stat-content p {
      color: var(--gray-500);
      font-size: 0.875rem;
    }
    
    .section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .section-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .view-all {
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .department-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .dept-card {
      padding: 1rem;
      background: var(--gray-50);
      border-radius: 8px;
    }
    
    .dept-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .dept-name {
      font-weight: 500;
    }
    
    .dept-count {
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .progress-bar {
      height: 6px;
      background: var(--gray-200);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
      padding: 0.875rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--gray-200);
    }
    
    .data-table th {
      font-weight: 600;
      color: var(--gray-600);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .data-table td {
      font-size: 0.875rem;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #dbeafe;
      color: #2563eb;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 9999px;
    }
    
    .no-data {
      text-align: center;
      color: var(--gray-500);
      padding: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentEmployees: Employee[] = [];
  isLoading = true;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.attendanceService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.employeeService.getAll().subscribe({
      next: (employees) => {
        this.recentEmployees = employees.slice(0, 5);
      }
    });
  }

  getDeptPercentage(count: number): number {
    if (!this.stats?.totalEmployees) return 0;
    return (count / this.stats.totalEmployees) * 100;
  }
}
