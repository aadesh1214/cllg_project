import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    .loading-text {
      margin-top: 1rem;
      color: var(--gray-500);
      font-size: 0.875rem;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading...';
}
