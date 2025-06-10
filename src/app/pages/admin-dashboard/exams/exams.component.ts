import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { Exam, ExamStatus, ExamType } from '../../../models/exam';
import { CommonModule } from '@angular/common';

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

  constructor(
    private examService: ExamService, 
    private fb: FormBuilder,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: [ExamType.Quiz1, Validators.required],
      date: ['', Validators.required],
      status: [ExamStatus.Scheduled, Validators.required],
    });
  }

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.exams = this.examService.getExams();
  }

  openModal() {
    this.showModal = true;
    this.examForm.reset({ 
      status: ExamStatus.Scheduled,
      type: ExamType.Quiz1 
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

  saveExam() {
    if (this.examForm.valid) {
      const exam: Exam = this.examForm.value;
      try {
        if (this.selectedExam) {
          this.examService.updateExam(exam);
          this.successMessage = `Exam "${exam.name}" updated successfully!`;
        } else {
          this.examService.addExam(exam);
          this.successMessage = `Exam "${exam.name}" added successfully!`;
        }
        this.loadExams();
        this.closeModal();
      } catch (error) {
        this.errorMessage = 'Failed to save the exam. Please try again.';
        console.error('Error saving exam:', error);
      }
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  editExam(exam: Exam) {
    this.selectedExam = exam;
    this.examForm.patchValue(exam);
    this.showModal = true;
    this.clearMessages();
  }

  deleteExam(id: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        this.examService.deleteExam(id);
        this.loadExams();
        this.successMessage = 'Exam deleted successfully!';
      } catch (error) {
        this.errorMessage = 'Failed to delete the exam. Please try again.';
        console.error('Error deleting exam:', error);
      }
    }
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }

  navigateToQuestions(examId: number) {
    this.router.navigate(['/questions'], { queryParams: { examId: examId } });
  }
}
