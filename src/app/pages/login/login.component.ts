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
      const role = this.authService.getCurrentUserRole()?.toLowerCase();
      if (role === 'student') {
        this.router.navigate(['/homeStudent']);
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    }
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
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
        next: (response) => {
          if (response.isFirstTime) {
            this.router.navigate(['/resetPassword']);
          } else {
            const role = response.role.toLowerCase();
            if (role === 'student') {
              this.router.navigate(['/homeStudent']);
            } else {
              this.router.navigate(['/admin/dashboard']);
            }
          }
          // Handle rememberMe
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberedEmail', this.loginForm.value.email!);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
        },
        error: (err) => {
          // Handle error (show message, etc.)
          console.error('Login failed', err);
        }
      });
    }
  }
}
