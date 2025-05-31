import { Component } from '@angular/core';

@Component({
  selector: 'app-home-student',
  imports: [],
  templateUrl: './home-student.component.html',
  styleUrl: './home-student.component.css'
})
export class HomeStudentComponent {
  numberOfExams: number = 10;
  numberOfPassedExams: number = 7;
  numberOfFailedExams: number = 3;
}
