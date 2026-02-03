import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '@app/core/services/employee.service';
import { ToastService } from '@app/core/services/toast.service';
import { Employee, CreateEmployeeDto } from '@app/core/models/employee.model';
import { LoadingSpinnerComponent } from '@app/shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="employees-page">
      <!-- Header -->
      <div class="page-header">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            placeholder="Search employees..." 
            [(ngModel)]="searchQuery"
            (input)="filterEmployees()"
          >
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">
          <span class="material-icons">add</span>
          Add Employee
        </button>
      </div>

      <!-- Content -->
      @if (isLoading) {
        <app-loading-spinner message="Loading employees..."></app-loading-spinner>
      } @else if (filteredEmployees.length === 0 && searchQuery === '') {
        <app-empty-state
          icon="people"
          title="No employees yet"
          description="Get started by adding your first employee to the system."
          actionLabel="Add Employee"
          (action)="openAddModal()"
        ></app-empty-state>
      } @else {
        <div class="table-container card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (employee of filteredEmployees; track employee.id) {
                <tr>
                  <td>
                    <div class="employee-name">
                      <div class="avatar">{{ getInitials(employee.name) }}</div>
                      {{ employee.name }}
                    </div>
                  </td>
                  <td>{{ employee.email }}</td>
                  <td>{{ employee.phone }}</td>
                  <td><span class="badge">{{ employee.department }}</span></td>
                  <td>{{ employee.designation }}</td>
                  <td>{{ employee.joiningDate | date:'mediumDate' }}</td>
                  <td>
                    <button class="btn-icon danger" (click)="openDeleteModal(employee)">
                      <span class="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="no-data">No employees found matching "{{ searchQuery }}"</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Add Employee Modal -->
      @if (showAddModal) {
        <div class="modal-overlay" (click)="closeAddModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Add New Employee</h2>
              <button class="btn-icon" (click)="closeAddModal()">
                <span class="material-icons">close</span>
              </button>
            </div>
            <form (ngSubmit)="addEmployee()" #addForm="ngForm">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name">Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    [(ngModel)]="newEmployee.name" 
                    name="name" 
                    required
                    placeholder="Enter full name"
                  >
                </div>
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    [(ngModel)]="newEmployee.email" 
                    name="email" 
                    required
                    placeholder="Enter email address"
                  >
                </div>
                <div class="form-group">
                  <label for="phone">Phone *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    [(ngModel)]="newEmployee.phone" 
                    name="phone" 
                    required
                    placeholder="Enter phone number"
                  >
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="department">Department *</label>
                    <select 
                      id="department" 
                      [(ngModel)]="newEmployee.department" 
                      name="department" 
                      required
                    >
                      <option value="">Select department</option>
                      @for (dept of departments; track dept) {
                        <option [value]="dept">{{ dept }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="designation">Designation *</label>
                    <input 
                      type="text" 
                      id="designation" 
                      [(ngModel)]="newEmployee.designation" 
                      name="designation" 
                      required
                      placeholder="Enter designation"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="joiningDate">Joining Date *</label>
                  <input 
                    type="date" 
                    id="joiningDate" 
                    [(ngModel)]="newEmployee.joiningDate" 
                    name="joiningDate" 
                    required
                  >
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeAddModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!addForm.valid || isSubmitting">
                  {{ isSubmitting ? 'Adding...' : 'Add Employee' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal && employeeToDelete) {
        <div class="modal-overlay" (click)="closeDeleteModal()">
          <div class="modal modal-sm" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Confirm Delete</h2>
              <button class="btn-icon" (click)="closeDeleteModal()">
                <span class="material-icons">close</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete <strong>{{ employeeToDelete.name }}</strong>?</p>
              <p class="text-muted">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeDeleteModal()">Cancel</button>
              <button class="btn btn-danger" (click)="confirmDelete()" [disabled]="isDeleting">
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .employees-page {
      padding: 1.5rem;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      padding: 0 1rem;
      flex: 1;
      max-width: 400px;
    }
    
    .search-box .material-icons {
      color: var(--gray-400);
    }
    
    .search-box input {
      border: none;
      outline: none;
      padding: 0.75rem;
      width: 100%;
      font-size: 0.875rem;
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
    
    .employee-name {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .avatar {
      width: 36px;
      height: 36px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
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
    
    .btn-icon {
      background: none;
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      color: var(--gray-500);
      transition: all 0.2s;
    }
    
    .btn-icon:hover {
      background: var(--gray-100);
    }
    
    .btn-icon.danger:hover {
      background: #fee2e2;
      color: var(--danger-color);
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
    
    .modal-sm {
      max-width: 400px;
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
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .text-muted {
      color: var(--gray-500);
      font-size: 0.875rem;
    }
    
    .btn-danger {
      background: var(--danger-color);
    }
    
    .btn-danger:hover {
      background: #b91c1c;
    }
  `]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  isLoading = true;
  searchQuery = '';
  
  // Modal states
  showAddModal = false;
  showDeleteModal = false;
  employeeToDelete: Employee | null = null;
  isSubmitting = false;
  isDeleting = false;
  
  // Form data
  newEmployee: CreateEmployeeDto = {
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: ''
  };
  
  departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load employees');
        this.isLoading = false;
      }
    });
  }

  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newEmployee = {
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      joiningDate: ''
    };
  }

  addEmployee(): void {
    this.isSubmitting = true;
    this.employeeService.create(this.newEmployee).subscribe({
      next: (employee) => {
        this.employees.unshift(employee);
        this.filterEmployees();
        this.toastService.success('Employee added successfully');
        this.closeAddModal();
        this.isSubmitting = false;
      },
      error: () => {
        this.toastService.error('Failed to add employee');
        this.isSubmitting = false;
      }
    });
  }

  openDeleteModal(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  confirmDelete(): void {
    if (!this.employeeToDelete) return;
    
    this.isDeleting = true;
    this.employeeService.delete(this.employeeToDelete.id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== this.employeeToDelete!.id);
        this.filterEmployees();
        this.toastService.success('Employee deleted successfully');
        this.closeDeleteModal();
        this.isDeleting = false;
      },
      error: () => {
        this.toastService.error('Failed to delete employee');
        this.isDeleting = false;
      }
    });
  }
}
