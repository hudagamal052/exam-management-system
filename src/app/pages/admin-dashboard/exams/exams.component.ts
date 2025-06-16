import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CreateExamRequest, Exam, ExamStatus, ExamType } from '../../../models/exam';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { isoDurationValidator } from '../../../utils/iso-duration.validator';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  showModal = false;
  examForm: FormGroup;
  selectedExam: Exam | null = null;
  examStatuses = Object.values(ExamStatus);
  examTypes = Object.values(ExamType);
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private examService: ExamService, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.examForm = this.fb.group({
      examId: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      examType: [ExamType.Quiz1, Validators.required],
      marks: [100, [Validators.required, Validators.min(1)]],
      startDate: [Date(), Validators.required],
      endDate: [Date(), Validators.required],
      duration: [null, [Validators.required, isoDurationValidator()]],
    });
  }

  ngOnInit() {
    // Check authentication first
    console.log('Authentication status:', this.authenticationService.isLoggedIn());
    console.log('Token:', this.authenticationService.getToken());
    
    if (!this.authenticationService.isLoggedIn()) {
      this.errorMessage = 'Please login to access exams.';
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadExams();
  }

  formatDurationInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase();
    
    if (!value.startsWith('PT')) {
      value = 'PT' + value.replace(/^PT/i, '');
    }
    
    input.value = value;
    this.examForm.get('duration')?.setValue(value);
  }

  loadExams() {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.isLoading = false;
      },

      
      error: (error) => {
        console.error('Error loading exams:', error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection and try again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You may not have permission to view exams.';
        } else if (error.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          this.authenticationService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 404) {
          this.errorMessage = 'API endpoint not found. Please contact administrator.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load exams. Please try again.';
        }
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.examForm.reset({ 
      examType: ExamType.Quiz1,
      marks: 100, // Default 100 marks
      durationSeconds: 3600 // Default 1 hour in seconds
    });
    this.selectedExam = null;
    this.clearMessages();
  }

  closeModal() {
    this.showModal = false;
    this.examForm.reset();
    this.selectedExam = null;
    this.clearMessages();
  }

  showDates(){
    console.log(`start date: ${this.examForm.value.startDate}, end date: ${this.examForm.value.endDate}`);
    
  }

  saveExam() {
    if (this.examForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      const formValue = this.examForm.value;
      
      // Format dates properly
      const startDate = formValue.startDate;
      const endDate = formValue.endDate;
      
      // Validate that endDate is after startDate
      if (new Date(endDate) <= new Date(startDate)) {
        this.errorMessage = 'End date must be after start date.';
        this.isSubmitting = false;
        return;
      }

      const exam: CreateExamRequest = {
        examId: formValue.examId || '',
        title: formValue.title,
        examType: formValue.examType,
        marks: formValue.marks,
        startDate: startDate,
        endDate: endDate,
        duration: formValue.duration
      };
      
      if (this.selectedExam) {
        // Update existing exam
        this.examService.updateExam(exam).subscribe({
          next: () => {
            this.successMessage = `Exam "${exam.title}" updated successfully!`;
            this.isSubmitting = false;
            this.loadExams();
            setTimeout(() => {
              this.closeModal();
            }, 1000);
          },
          error: (error) => {
            this.errorMessage = 'Failed to update the exam. Please try again.';
            this.isSubmitting = false;
            console.error('Error updating exam:', error);
            
            // Show more specific error messages
            if (error.error && error.error.message) {
              this.errorMessage = `Error: ${error.error.message}`;
            } else if (error.status === 500) {
              this.errorMessage = 'Server error. Please check the data and try again.';
            } else if (error.status === 400) {
              this.errorMessage = 'Invalid data. Please check all fields and try again.';
            }
          }
        });
      } else {
        // Add new exam
        this.examService.addExam(exam).subscribe({
          next: () => {
            this.successMessage = `Exam "${exam.title}" added successfully!`;
            this.isSubmitting = false;
        this.loadExams();
            setTimeout(() => {
        this.closeModal();
            }, 1000);
          },
          error: (error) => {
            this.errorMessage = 'Failed to add the exam. Please try again.';
            this.isSubmitting = false;
            console.error('Error adding exam:', error);
            
            // Show more specific error messages
            if (error.error && error.error.message) {
              this.errorMessage = `Error: ${error.error.message}`;
            } else if (error.status === 500) {
              this.errorMessage = 'Server error. Please check the data and try again.';
            } else if (error.status === 400) {
              this.errorMessage = 'Invalid data. Please check all fields and try again.';
            }
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  editExam(exam: Exam) {
    this.selectedExam = exam;
    this.examForm.patchValue({
      examId: exam.examId,
      title: exam.title,
      examType: exam.examType,
      marks: exam.marks,
      startDate: exam.startDate,
      endDate: exam.endDate,
      durationSeconds: exam.duration
    });
    this.showModal = true;
    this.clearMessages();
  }

  deleteExam(examId: string) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
        this.loadExams();
        this.successMessage = 'Exam deleted successfully!';
        },
        error: (error) => {
        this.errorMessage = 'Failed to delete the exam. Please try again.';
        console.error('Error deleting exam:', error);
      }
      });
    }
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }

  navigateToQuestions(examId: string) {
    this.router.navigate(['/admin/questions'], { queryParams: { examId: examId } });
  }

  // Helper method to get duration in minutes for display
  getDurationInMinutes(duration: any): number {
    return Math.floor(duration.seconds / 60);
  }
}
