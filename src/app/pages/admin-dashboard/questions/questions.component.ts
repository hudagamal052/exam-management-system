import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import {
  Question,
  QuestionType,
  QuestionDifficulty,
} from '../../../models/question';
import { Exam, ExamType } from '../../../models/exam';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  // Make enums available in the template
  QuestionType = QuestionType;
  ExamType = ExamType;

  questions: Question[] = [];
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  examTypes = Object.values(ExamType);
  selectedExamType: ExamType | null = null;
  showModal = false;
  questionForm: FormGroup;
  selectedQuestion: Question | null = null;
  questionTypes = Object.values(QuestionType);
  questionDifficulties = Object.values(QuestionDifficulty);
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedExamId: string | null = null;
  examMap: Map<string, string> = new Map();

  constructor(
    public questionService: QuestionService,
    private examService: ExamService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      questionId: [''],
      text: ['', [Validators.required, Validators.minLength(10)]],
      type: [QuestionType.MultipleChoice, Validators.required],
      difficulty: [QuestionDifficulty.Medium, Validators.required],
      marks: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      examId: ['', Validators.required],
      wrongAnswer: this.fb.array([]),
      rightAnswer: this.fb.array([]),
      isRight: [true],
    });
  }

  ngOnInit() {
    this.loadExams();
    this.setupQuestionTypeListener();

    // Handle examId from query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['examId']) {
        const examId = params['examId'];
        this.selectedExamId = examId;
        this.loadQuestions();
      }
    });
  }

  get wrongAnswer() {
    return this.questionForm.get('wrongAnswer') as FormArray;
  }

  get rightAnswer() {
    return this.questionForm.get('rightAnswer') as FormArray;
  }

  setupQuestionTypeListener() {
    this.questionForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === QuestionType.TrueFalse) {
        // Clear existing answers
        while (this.wrongAnswer.length) {
          this.wrongAnswer.removeAt(0);
        }
        while (this.rightAnswer.length) {
          this.rightAnswer.removeAt(0);
        }
        // Add True/False options
        this.wrongAnswer.push(this.fb.control('False'));
        this.rightAnswer.push(this.fb.control('True'));
      } else if (type === QuestionType.MultipleChoice) {
        // Clear existing answers
        while (this.wrongAnswer.length) {
          this.wrongAnswer.removeAt(0);
        }
        while (this.rightAnswer.length) {
          this.rightAnswer.removeAt(0);
        }
        // Add default multiple choice options
        this.addWrongAnswer();
        this.addWrongAnswer();
        this.addRightAnswer();
      }
    });
  }

  addWrongAnswer() {
    if (this.questionForm.get('type')?.value === QuestionType.MultipleChoice) {
      this.wrongAnswer.push(this.fb.control('', Validators.required));
    }
  }

  addRightAnswer() {
    if (this.questionForm.get('type')?.value === QuestionType.MultipleChoice) {
      this.rightAnswer.push(this.fb.control('', Validators.required));
    }
  }

  removeWrongAnswer(index: number) {
    if (
      this.questionForm.get('type')?.value === QuestionType.MultipleChoice &&
      this.wrongAnswer.length > 1
    ) {
      this.wrongAnswer.removeAt(index);
    }
  }

  removeRightAnswer(index: number) {
    if (
      this.questionForm.get('type')?.value === QuestionType.MultipleChoice &&
      this.rightAnswer.length > 1
    ) {
      this.rightAnswer.removeAt(index);
    }
  }

  loadExams() {
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.examMap = new Map(this.exams.map((exam) => [exam.examId, exam.title]));
    this.filterExams();
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.errorMessage = 'Failed to load exams. Please try again.';
      }
    });
  }

  filterExams() {
    if (this.selectedExamType) {
      this.filteredExams = this.exams.filter(
        (exam) => exam.examType === this.selectedExamType
      );
    } else {
      this.filteredExams = [...this.exams];
    }
  }

  onExamTypeChange(type: ExamType | null) {
    this.selectedExamType = type;
    this.filterExams();
    // Reset selected exam if it's not in the filtered list
    if (
      this.selectedExamId &&
      !this.filteredExams.find((exam) => exam.examId === this.selectedExamId)
    ) {
      this.selectedExamId = null;
      this.questions = [];
    }
  }

  getSelectedExamType(): string {
    if (!this.selectedExamId) return '';
    const exam = this.exams.find((e) => e.examId === this.selectedExamId);
    return exam ? exam.examType : '';
  }

  getExamName(examId: string): string {
    return this.examMap.get(examId) || 'Unknown Exam';
  }

  loadQuestions() {
    console.log('Component: Loading questions for exam:', this.selectedExamId);
    console.log('Component: Selected exam ID type:', typeof this.selectedExamId);
    console.log('Component: Selected exam ID value:', this.selectedExamId);
    
    if (this.selectedExamId) {
      console.log('Component: Calling service to get questions...');
      this.questionService.getQuestionsByExamId(this.selectedExamId).subscribe({
        next: (questions) => {
          console.log('Component: Service returned questions:', questions);
          console.log('Component: Questions count:', questions.length);
          console.log('Component: Questions details:', questions.map(q => ({ id: q.questionId, text: q.text.substring(0, 50) + '...' })));
          this.questions = questions;
          console.log('Component: Questions loaded into component:', this.questions.length);
        },
        error: (error) => {
          console.error('Component: Error loading questions:', error);
          this.errorMessage = 'Failed to load questions. Please try again.';
        }
      });
    } else {
      console.log('Component: No exam selected, clearing questions');
      this.questions = [];
    }
  }

  getQuestionTypeCount(type: QuestionType): number {
    return this.questions.filter((q) => q.type === type).length;
  }

  onExamChange(examId: string | null) {
    console.log('Exam change triggered with examId:', examId);
    console.log('Exam ID type:', typeof examId);
    console.log('Available exams:', this.exams.map(e => ({ id: e.examId, title: e.title })));
    
    this.selectedExamId = examId;
    // Update URL with selected exam ID
    if (examId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { examId: examId },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: 'merge',
      });
    }
    this.loadQuestions();
    this.clearMessages();
  }

  openModal(question?: Question) {
    if (!this.selectedExamId && !question) {
      this.errorMessage = 'Please select an exam first';
      return;
    }

    this.selectedQuestion = question || null;
    this.questionForm.reset({
      type: QuestionType.MultipleChoice,
      difficulty: QuestionDifficulty.Medium,
      marks: 1,
      examId: this.selectedExamId || '',
      isRight: true,
    });

    if (question) {
      this.questionForm.patchValue({
        text: question.text,
        type: question.type,
        difficulty: question.difficulty || QuestionDifficulty.Medium,
        marks: question.marks,
        isRight: question.isRight,
      });

      // Set up answers based on question type
      if (question.type === QuestionType.MultipleChoice) {
        // Clear existing answers first
        while (this.wrongAnswer.length) {
          this.wrongAnswer.removeAt(0);
        }
        while (this.rightAnswer.length) {
          this.rightAnswer.removeAt(0);
        }
        // Add wrong answers
        question.wrongAnswer.forEach((answer) => {
          this.wrongAnswer.push(this.fb.control(answer, Validators.required));
        });
        // Add right answers
        question.rightAnswer.forEach((answer) => {
          this.rightAnswer.push(this.fb.control(answer, Validators.required));
        });
      } else if (question.type === QuestionType.TrueFalse) {
        // Clear existing answers
        while (this.wrongAnswer.length) {
          this.wrongAnswer.removeAt(0);
        }
        while (this.rightAnswer.length) {
          this.rightAnswer.removeAt(0);
        }
        // Add True/False options
        this.wrongAnswer.push(this.fb.control('False'));
        this.rightAnswer.push(this.fb.control('True'));
      }
    } else {
      // For new questions, set default exam if one is selected
      if (this.selectedExamId) {
        this.questionForm.patchValue({ examId: this.selectedExamId });
      }
      // Initialize with default multiple choice options
      this.addWrongAnswer();
      this.addWrongAnswer();
      this.addRightAnswer();
    }

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.questionForm.reset();
    this.selectedQuestion = null;
    this.clearMessages();
  }

  saveQuestion() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData: Question = {
        questionId: this.selectedQuestion?.questionId || '',
        examId: formValue.examId,
        text: formValue.text,
        type: formValue.type,
        difficulty: formValue.difficulty,
        marks: formValue.marks,
        isRight: formValue.isRight,
        wrongAnswer: formValue.wrongAnswer,
        rightAnswer: formValue.rightAnswer,
      };

      console.log('Sending question data:', questionData);

      if (this.selectedQuestion) {
        this.questionService.updateQuestion(questionData).subscribe({
          next: () => {
        this.successMessage = 'Question updated successfully!';
            this.closeModal();
            this.loadQuestions();
          },
          error: (error) => {
            this.errorMessage = 'Failed to update the question. Please try again.';
            console.error('Error updating question:', error);
          }
        });
      } else {
        this.questionService.addQuestion(questionData).subscribe({
          next: () => {
        this.successMessage = 'Question added successfully!';
            this.closeModal();
            this.loadQuestions();
          },
          error: (error) => {
            this.errorMessage = 'Failed to add the question. Please try again.';
            console.error('Error adding question:', error);
          }
        });
      }
    } else {
      console.log('Form is invalid:', this.questionForm.errors);
      console.log('Form values:', this.questionForm.value);
    }
  }

  editQuestion(question: Question) {
    this.selectedQuestion = question;
    this.questionForm.patchValue({
      questionId: question.questionId,
      text: question.text,
      type: question.type,
      difficulty: question.difficulty || QuestionDifficulty.Medium,
      marks: question.marks,
      isRight: question.isRight,
    });
    this.showModal = true;
    this.clearMessages();
  }

  deleteQuestion(questionId: string) {
    console.log('Component: Delete question requested with ID:', questionId);
    console.log('Component: Question ID type:', typeof questionId);
    console.log('Component: Current questions count:', this.questions.length);
    console.log('Component: Question to delete:', this.questions.find(q => q.questionId === questionId));
    
    if (confirm('Are you sure you want to delete this question?')) {
      console.log('Component: User confirmed deletion, calling service...');
      
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          console.log('Component: Delete successful, reloading questions...');
          this.loadQuestions();
          this.successMessage = 'Question deleted successfully!';
          console.log('Component: Questions reloaded, new count:', this.questions.length);
        },
        error: (error) => {
          console.error('Component: Delete failed:', error);
          this.errorMessage = 'Failed to delete the question. Please try again.';
          console.error('Error deleting question:', error);
        }
      });
    } else {
      console.log('Component: User cancelled deletion');
    }
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
