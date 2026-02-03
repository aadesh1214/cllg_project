import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '@app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts$ | async; track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="material-icons">
            {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
          </span>
          <span>{{ toast.message }}</span>
          <button class="toast-close" (click)="remove(toast.id)">
            <span class="material-icons">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1100;
    }
    
    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease;
      min-width: 300px;
    }
    
    .toast-success {
      background-color: var(--success-color);
      color: white;
    }
    
    .toast-error {
      background-color: var(--danger-color);
      color: white;
    }
    
    .toast-info {
      background-color: var(--primary-color);
      color: white;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: inherit;
      margin-left: auto;
      cursor: pointer;
      opacity: 0.8;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
    
    .toast-close .material-icons {
      font-size: 1.125rem;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  toasts$ = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
