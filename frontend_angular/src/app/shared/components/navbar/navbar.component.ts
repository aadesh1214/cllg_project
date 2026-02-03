import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="navbar">
      <h2 class="page-title">{{ pageTitle }}</h2>
      <div class="user-info">
        <div class="user-details">
          <span class="user-name">Admin</span>
          <span class="user-role">Administrator</span>
        </div>
        <div class="avatar">A</div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: var(--navbar-height);
      background: white;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    .page-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gray-700);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .user-name {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .user-role {
      font-size: 0.75rem;
      color: var(--gray-500);
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
    }
  `]
})
export class NavbarComponent {
  pageTitle = 'Dashboard';

  private pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/employees': 'Employees',
    '/attendance': 'Attendance'
  };

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects)
    ).subscribe(url => {
      this.pageTitle = this.pageTitles[url] || 'HRMS Lite';
    });
  }
}
