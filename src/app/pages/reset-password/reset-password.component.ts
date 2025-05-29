import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  isSubmitting = false;

  constructor(private router: Router) { }

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
      setTimeout(() => {
        console.log('Password reset data:', {
          password: this.resetPasswordForm.value.password
        });
        alert('Password reset successful! Redirecting to login...');
        this.router.navigate(['/login']);
        this.isSubmitting = false;
      }, 1000);
    }
  }
}
