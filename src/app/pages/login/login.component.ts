import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl<boolean>(false)
  });

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  get getEmail() {
    return this.loginForm.controls["email"];
  }

  get getPassword() {
    return this.loginForm.controls["password"];
  }

  get getRememberMe() {
    return this.loginForm.controls["rememberMe"];
  }

  login() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(["/admin/dashboard"]);
        },
        error: (err) => {
          // Handle error (show message, etc.)
          console.error('Login failed', err);
        }
      });
    }
  }
}
