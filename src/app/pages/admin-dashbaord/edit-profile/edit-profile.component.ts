import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/user';

@Component({
  selector: 'app-edit-profile',
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  teacher: Teacher = {} as Teacher;
  loading = true;
  
  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
      
  }

  updateTeacher(){

  }
}
