import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="icon-container">
        <span class="material-icons">{{ icon }}</span>
      </div>
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
      @if (actionLabel) {
        <button class="btn btn-primary" (click)="action.emit()">
          <span class="material-icons">add</span>
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
    }
    
    .icon-container {
      width: 64px;
      height: 64px;
      background: var(--gray-100);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .icon-container .material-icons {
      font-size: 2rem;
      color: var(--gray-400);
    }
    
    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 0.5rem;
    }
    
    .description {
      color: var(--gray-500);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      max-width: 300px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No data found';
  @Input() description = 'There are no items to display.';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
