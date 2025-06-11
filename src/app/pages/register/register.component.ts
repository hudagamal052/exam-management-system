import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl } from '@angular/forms'; import { CommonModule } from '@angular/common';
import { IStudent } from '../../models/istudent';
import { RegisterRequest } from '../../models/auth-response';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isSubmitting = false;

  studentData: IStudent = {
    id: 0,
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: ''
    },
    image: '',
    role: 'Student',
    firstTime: true
  };

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('')
    })
  }, { validators: this.passwordMatchValidator() });

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  get getName() {
    return this.registerForm.get('name')!;
  }

  get getEmail() {
    return this.registerForm.get('email')!;
  }

  get getPassword() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  get getPhone() {
    return this.registerForm.get('phone')!;
  }

  get getCity() {
    return this.registerForm.get('address')?.get('city')!;
  }

  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const formValue = this.registerForm.value;
      
      const registerData: RegisterRequest = {
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        password: formValue.password ?? '',
        phone: formValue.phone ?? '',
        address: {
          street: formValue.address?.street ?? '',
          city: formValue.address?.city ?? '',
          country: formValue.address?.country ?? ''
        },
        role: 'Student',
        firstTime: true
      };

      // Call the authentication service to register the user
      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          alert('Registration successful! Redirecting to login...');
          this.router.navigate(['/login']);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed: ' + error.message);
          this.isSubmitting = false;
        }
      });
    }
  }

}
