import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(private router: Router, private location: Location) { }

  goToHome() {
    this.router.navigate(['/homeStudent/main']);
  }

  goBack() {
    this.location.back();
  }
}
