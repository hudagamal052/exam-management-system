import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IExam } from '../../models/iexam';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exams-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams-student.component.html',
  styleUrl: './exams-student.component.css'
})
export class ExamsStudentComponent {
  exams: IExam[] = [
    {
      id: 1,
      title: 'Mathematics Exam',
      startDateTime: '2025-06-02 10:00',
      endDateTime: '2025-06-02 15:00',
      duration: 60
    },
    {
      id: 2,
      title: 'Physics Exam',
      startDateTime: '2025-06-02 15:00',
      endDateTime: '2025-06-02 18:00',
      duration: 90
    },
    {
      id: 3,
      title: 'Chemistry Exam',
      startDateTime: '2025-06-03 09:00',
      endDateTime: '2025-06-03 13:00',
      duration: 120
    },
    {
      id: 4,
      title: 'Biology Exam',
      startDateTime: '2025-06-03 14:00',
      endDateTime: '2025-06-03 18:00',
      duration: 90
    },
    {
      id: 5,
      title: 'English Exam',
      startDateTime: '2025-06-04 10:00',
      endDateTime: '2025-06-04 14:00',
      duration: 60
    },
    {
      id: 6,
      title: 'History Exam',
      startDateTime: '2025-06-04 15:00',
      endDateTime: '2025-06-04 18:00',
      duration: 90
    },
    {
      id: 7,
      title: 'Geography Exam',
      startDateTime: '2025-06-05 10:00',
      endDateTime: '2025-06-05 14:00',
      duration: 60
    },
    {
      id: 8,
      title: 'Art Exam',
      startDateTime: '2025-06-05 15:00',
      endDateTime: '2025-06-05 18:00',
      duration: 90
    },
    {
      id: 9,
      title: 'Music Exam',
      startDateTime: '2025-06-06 10:00',
      endDateTime: '2025-06-06 14:00',
      duration: 60
    },
    {
      id: 10,
      title: 'Computer Science Exam',
      startDateTime: '2025-06-06 15:00',
      endDateTime: '2025-06-06 18:00',
      duration: 90
    }
  ];

  currentDateTime: Date = new Date();
  filteredExams: IExam[] = [];

  constructor(private router: Router) {
    this.filterExamsByCurrentDay();
  }

  filterExamsByCurrentDay() {
    const currentDay = this.currentDateTime.toISOString().split('T')[0];
    this.filteredExams = this.exams.filter(exam => {
      const examDay = exam.startDateTime.split(' ')[0];
      return examDay === currentDay;
    });
  }

  isExamActive(exam: IExam): boolean {
    const startDateTime = new Date(exam.startDateTime.replace(' ', 'T') + '+03:00');
    const endDateTime = new Date(exam.endDateTime.replace(' ', 'T') + '+03:00');
    const currentTime = this.currentDateTime;

    return currentTime >= startDateTime && currentTime <= endDateTime;
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime.replace(' ', 'T') + '+03:00');
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  startExam(examId: number) {
    const exam = this.exams.find(e => e.id === examId);
    if (exam && this.isExamActive(exam)) {
      this.router.navigate(['/homeStudent/exam-questions', examId], {
        state: { duration: exam.duration }
      });
    }
  }
}
