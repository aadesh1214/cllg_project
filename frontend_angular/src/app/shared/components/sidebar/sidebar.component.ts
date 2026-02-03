import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="logo">📋 HRMS Lite</h1>
      </div>
      
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="material-icons">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/employees" routerLinkActive="active" class="nav-item">
          <span class="material-icons">people</span>
          <span>Employees</span>
        </a>
        <a routerLink="/attendance" routerLinkActive="active" class="nav-item">
          <span class="material-icons">calendar_today</span>
          <span>Attendance</span>
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <p>HRMS Lite v1.0.0</p>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: white;
      border-right: 1px solid var(--gray-200);
      display: flex;
      flex-direction: column;
      z-index: 100;
    }
    
    .sidebar-header {
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      border-bottom: 1px solid var(--gray-200);
    }
    
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: var(--gray-600);
      font-weight: 500;
      margin-bottom: 0.25rem;
      transition: all 0.2s;
    }
    
    .nav-item:hover {
      background: var(--gray-100);
      color: var(--gray-800);
    }
    
    .nav-item.active {
      background: #eff6ff;
      color: var(--primary-color);
    }
    
    .nav-item .material-icons {
      font-size: 1.25rem;
    }
    
    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--gray-200);
      text-align: center;
    }
    
    .sidebar-footer p {
      font-size: 0.75rem;
      color: var(--gray-500);
    }
    
    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {}
