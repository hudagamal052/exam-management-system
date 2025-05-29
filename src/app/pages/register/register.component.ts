import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl } from '@angular/forms'; import { CommonModule } from '@angular/common';
import { IStudent } from '../../models/istudent';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  studentData: IStudent = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'student',
    firstTime: true
  };

  constructor(private router: Router) { }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
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

  register() {
    if (this.registerForm.valid) {
      this.studentData = {
        id: 0,
        name: this.registerForm.value.name ?? '',
        email: this.registerForm.value.email ?? '',
        password: this.registerForm.value.password ?? '',
        role: 'student',
        firstTime: false
      };
      console.log(this.studentData);
      alert('Registration successful! Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

}
