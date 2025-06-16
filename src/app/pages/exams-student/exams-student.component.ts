import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserExamsService } from '../../services/user-exams.service';
import { CurrentExam } from '../../models/exam-types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exams-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams-student.component.html',
  styleUrl: './exams-student.component.css'
})
export class ExamsStudentComponent implements OnInit {
  currentExams: CurrentExam[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private userExamsService: UserExamsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentExams();
  }

  loadCurrentExams(): void {
    this.loading = true;
    this.error = null;

    this.userExamsService.getCurrentExams().subscribe({
      next: (exams) => {
        this.currentExams = exams;
        console.log(this.currentExams);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load exams. Please try again later.';
        this.loading = false;
        console.error('Error loading exams:', err);
      }
    });
  }

  isExamAvailable(exam: CurrentExam): boolean {
    return this.userExamsService.isExamActive(exam);
  }

  startExam(examId: string): void {
    this.router.navigate(['homeStudent/exam-questions', examId]);
  }

  getTimeRemaining(exam: CurrentExam): string {
    return this.userExamsService.getTimeRemaining(exam);
  }

  formatDuration(duration: string): string {
    if (!duration) {
      return 'Duration not set';
    }

    const [hours, minutes, seconds] = duration.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return 'Duration not set';
    }

    const totalMinutes = (hours * 60) + minutes;

    if (totalMinutes === 0) {
      return `${minutes} minutes`;
    }

    if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  formatDateTime(dateString: string): string {
    return this.userExamsService.formatDateTime(dateString);
  }
}
