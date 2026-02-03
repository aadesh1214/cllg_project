import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '@app/core/services/attendance.service';
import { EmployeeService } from '@app/core/services/employee.service';
import { ToastService } from '@app/core/services/toast.service';
import { Attendance, CreateAttendanceDto } from '@app/core/models/attendance.model';
import { Employee } from '@app/core/models/employee.model';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="attendance-page">
      <!-- Header -->
      <div class="page-header">
        <div class="filters">
          <div class="filter-group">
            <label>Date</label>
            <input 
              type="date" 
              [(ngModel)]="filterDate"
              (change)="filterAttendance()"
            >
          </div>
          <div class="filter-group">
            <label>Status</label>
            <select [(ngModel)]="filterStatus" (change)="filterAttendance()">
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" (click)="openMarkModal()">
          <span class="material-icons">add</span>
          Mark Attendance
        </button>
      </div>

      <!-- Content -->
      @if (isLoading) {
        <app-loading-spinner message="Loading attendance records..."></app-loading-spinner>
      } @else if (filteredRecords.length === 0 && !filterDate && !filterStatus) {
        <app-empty-state
          icon="calendar_today"
          title="No attendance records"
          description="Start tracking employee attendance by marking attendance for today."
          actionLabel="Mark Attendance"
          (action)="openMarkModal()"
        ></app-empty-state>
      } @else {
        <div class="table-container card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              @for (record of filteredRecords; track record.id) {
                <tr>
                  <td>
                    <div class="employee-info">
                      <div class="avatar">{{ getInitials(record.employeeName || 'U') }}</div>
                      <span>{{ record.employeeName || 'Unknown' }}</span>
                    </div>
                  </td>
                  <td>{{ record.date | date:'mediumDate' }}</td>
                  <td>{{ record.checkIn || '-' }}</td>
                  <td>{{ record.checkOut || '-' }}</td>
                  <td>
                    <span class="status-badge" [class]="getStatusClass(record.status)">
                      {{ record.status }}
                    </span>
                  </td>
                  <td>{{ record.notes || '-' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="no-data">No records found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Mark Attendance Modal -->
      @if (showMarkModal) {
        <div class="modal-overlay" (click)="closeMarkModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Mark Attendance</h2>
              <button class="btn-icon" (click)="closeMarkModal()">
                <span class="material-icons">close</span>
              </button>
            </div>
            <form (ngSubmit)="markAttendance()" #markForm="ngForm">
              <div class="modal-body">
                <div class="form-group">
                  <label for="employee">Employee *</label>
                  <select 
                    id="employee" 
                    [(ngModel)]="newAttendance.employeeId" 
                    name="employeeId" 
                    required
                  >
                    <option value="">Select employee</option>
                    @for (emp of employees; track emp.id) {
                      <option [value]="emp.id">{{ emp.name }} ({{ emp.department }})</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="date">Date *</label>
                  <input 
                    type="date" 
                    id="date" 
                    [(ngModel)]="newAttendance.date" 
                    name="date" 
                    required
                  >
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="checkIn">Check In</label>
                    <input 
                      type="time" 
                      id="checkIn" 
                      [(ngModel)]="newAttendance.checkIn" 
                      name="checkIn"
                    >
                  </div>
                  <div class="form-group">
                    <label for="checkOut">Check Out</label>
                    <input 
                      type="time" 
                      id="checkOut" 
                      [(ngModel)]="newAttendance.checkOut" 
                      name="checkOut"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="status">Status *</label>
                  <select 
                    id="status" 
                    [(ngModel)]="newAttendance.status" 
                    name="status" 
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="notes">Notes</label>
                  <textarea 
                    id="notes" 
                    [(ngModel)]="newAttendance.notes" 
                    name="notes"
                    rows="3"
                    placeholder="Add any notes..."
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeMarkModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!markForm.valid || isSubmitting">
                  {{ isSubmitting ? 'Saving...' : 'Mark Attendance' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .attendance-page {
      padding: 1.5rem;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .filter-group label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--gray-600);
    }
    
    .filter-group input,
    .filter-group select {
      padding: 0.625rem 1rem;
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      font-size: 0.875rem;
      min-width: 160px;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--gray-200);
    }
    
    .data-table th {
      font-weight: 600;
      color: var(--gray-600);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--gray-50);
    }
    
    .data-table td {
      font-size: 0.875rem;
    }
    
    .employee-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 9999px;
    }
    
    .status-present {
      background: #dcfce7;
      color: #16a34a;
    }
    
    .status-absent {
      background: #fee2e2;
      color: #dc2626;
    }
    
    .status-late {
      background: #fef3c7;
      color: #d97706;
    }
    
    .status-half-day {
      background: #e0e7ff;
      color: #4f46e5;
    }
    
    .no-data {
      text-align: center;
      color: var(--gray-500);
      padding: 2rem !important;
    }
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    
    .modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlide 0.3s ease;
    }
    
    @keyframes modalSlide {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--gray-200);
    }
    
    .modal-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .btn-icon {
      background: none;
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      color: var(--gray-500);
    }
    
    .btn-icon:hover {
      background: var(--gray-100);
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--gray-200);
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  `]
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];
  filteredRecords: Attendance[] = [];
  employees: Employee[] = [];
  isLoading = true;
  
  // Filters
  filterDate = '';
  filterStatus = '';
  
  // Modal
  showMarkModal = false;
  isSubmitting = false;
  newAttendance: CreateAttendanceDto = {
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: '',
    notes: ''
  };

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.attendanceService.getAll().subscribe({
      next: (data) => {
        this.attendanceRecords = data;
        this.filteredRecords = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load attendance records');
        this.isLoading = false;
      }
    });

    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
      }
    });
  }

  filterAttendance(): void {
    this.filteredRecords = this.attendanceRecords.filter(record => {
      let matchDate = true;
      let matchStatus = true;
      
      if (this.filterDate) {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        matchDate = recordDate === this.filterDate;
      }
      
      if (this.filterStatus) {
        matchStatus = record.status === this.filterStatus;
      }
      
      return matchDate && matchStatus;
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Present': 'status-present',
      'Absent': 'status-absent',
      'Late': 'status-late',
      'Half Day': 'status-half-day'
    };
    return statusMap[status] || '';
  }

  openMarkModal(): void {
    this.showMarkModal = true;
    this.resetForm();
  }

  closeMarkModal(): void {
    this.showMarkModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newAttendance = {
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      status: '',
      notes: ''
    };
  }

  markAttendance(): void {
    this.isSubmitting = true;
    this.attendanceService.markAttendance(this.newAttendance).subscribe({
      next: (record) => {
        // Add employee name to the record
        const employee = this.employees.find(e => e.id === record.employeeId);
        record.employeeName = employee?.name;
        
        this.attendanceRecords.unshift(record);
        this.filterAttendance();
        this.toastService.success('Attendance marked successfully');
        this.closeMarkModal();
        this.isSubmitting = false;
      },
      error: () => {
        this.toastService.error('Failed to mark attendance');
        this.isSubmitting = false;
      }
    });
  }
}
