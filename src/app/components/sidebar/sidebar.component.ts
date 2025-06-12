import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isLoggingOut = false;

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) {}

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.isLoggingOut = true;
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
  }

  getCurrentUserEmail(): string | null {
    return this.authenticationService.getCurrentUserEmail();
  }

  getCurrentUserRole(): string | null {
    return this.authenticationService.getCurrentUserRole();
  }
}
