import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = {email:'' , password: ''}

  constructor(private authService: AuthenticationService, private router: Router){  }

  loginUser(){
    this.authService.login(this.loginForm).subscribe((value)=>{
      this.router.navigate(["/admin/dashboard"])
    });
  }

  changeEmail(email:Event){
    this.loginForm.email = (<HTMLInputElement>email.target).value;

    console.log(this.loginForm.email);
  
  }
}
