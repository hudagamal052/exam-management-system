import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
// import { DashboardComponent } from '../../components/dashboard/dashboard.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterOutlet,
    HeaderComponent,
    // DashboardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit{
  isLoggingOut = false;
  constructor(private authService :AuthenticationService, private router: Router){}

  ngOnInit(): void {
      console.log(this.authService.getCurrentUserEmail());
  }
  logout(){
    if (confirm('Are you sure you want to logout?')) {
      this.isLoggingOut = true;
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
