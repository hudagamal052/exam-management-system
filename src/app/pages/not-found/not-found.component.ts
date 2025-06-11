import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(private authService: AuthenticationService, private router: Router, private location: Location) { }

  goToHome() {
    const role = this.authService.getCurrentUserRole()?.toLowerCase();
    if (role === 'student') {
      this.router.navigate(['/homeStudent']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  goBack() {
    this.location.back();
  }
}
