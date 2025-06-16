import { Component, OnInit } from '@angular/core';
import { UserState } from '../../../models/user-state';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  students: UserState[] = [];

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit(): void {
      this.getAllUsersResult();
  }
  getAllUsersResult() {
    this.usersService.getAllStudentsState().subscribe({
      next: (value) => {
        this.students = value;
      },
      error: (e) => {
        console.log('error in results: ' + e);
        
      }
    });
  }
  navigateToResultDeatils(email: string) {
    const encodedEmail = encodeURIComponent(email);
    this.router.navigate(['admin/user', encodedEmail]);
  }
}
