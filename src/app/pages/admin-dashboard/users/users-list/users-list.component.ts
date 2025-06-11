import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { UserState } from '../../../../models/user-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  studentState: UserState[] = [];

  constructor(private userService: UsersService, private router: Router){}

  ngOnInit(): void {
      this.userService.getAllStudentsState().subscribe((value)=>{
        this.studentState = value;
        console.log(this.studentState);
        
      })
  }

  goToEditPage(email:string){
    console.log("email" + email);
    this.router.navigate(['/edit' , ])
  }
  deleteUser(email:string){
    this.userService.getAllStudentsState
    
  }
}
