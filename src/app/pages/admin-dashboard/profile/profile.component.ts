import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../../models/user';
import { TeacherService } from '../../../services/teacher.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  teacher: Teacher = {} as Teacher;
  loading = true;
  now = new Date();
  activeExamsCount = 0;

  constructor(private teacherService: TeacherService, private router:Router) {}

  ngOnInit(): void {
    this.loadTeacherProfile();
  }

  loadTeacherProfile(): void {
    this.teacherService.getTeacherProfile().subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.activeExamsCount = teacher.createdExams?.filter(
          exam => exam.endDate && new Date(exam.endDate) > this.now
        ).length || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load teacher profile', err);
        this.loading = false;
      }
    });
  }

  navToEditProfile(){
    this.router.navigate(['/admin/profile/edit']);
  }
}
