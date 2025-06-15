import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  isSubmitting = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: this.passwordMatchValidator() });

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }
  get getPassword() {
    return this.resetPasswordForm.get('password')!;
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword')!;
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.isSubmitting = true;
      const resetData = {
        password: this.resetPasswordForm.value.password!,
        token: localStorage.getItem('auth_token') || ''
      };
      this.authService.resetPassword(resetData).subscribe({
        next: () => {
          localStorage.setItem('isFirstTime', 'false');
          const role = this.authService.getCurrentUserRole()?.toLowerCase();
          if (role === 'student') {
            this.router.navigate(['/homeStudent']);
          } else {
            this.router.navigate(['/admin/dashboard']);
          }
          this.isSubmitting = false;
        },
        error: (err: Error) => {
          console.log(`Password reset failed: ${JSON.stringify(err)}`);
          
          alert('Password reset failed. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
