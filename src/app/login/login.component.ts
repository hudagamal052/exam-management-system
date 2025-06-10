import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm = {email:'' , password: ''};

  constructor(private authService: AuthenticationService,private router: Router){  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  loginUser(){
    console.log('login clicked');
    
    this.authService.login(this.loginForm).subscribe((value)=>{
      this.router.navigate(["/admin/dashboard"])
    });
  }

  changeEmail(email:Event){
    this.loginForm.email = (<HTMLInputElement>email.target).value;

    console.log(this.loginForm.email);
  
  }
}
