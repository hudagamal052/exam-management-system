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
  selectedExamId: number | null = null;
  examMap: Map<number, string> = new Map();

  constructor(
    private questionService: QuestionService,
    private examService: ExamService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      id: [null],
      text: ['', [Validators.required, Validators.minLength(10)]],
      type: [QuestionType.MultipleChoice, Validators.required],
      difficulty: [QuestionDifficulty.Medium, Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      examId: [null, Validators.required],
      options: this.fb.array([]),
      correctAnswer: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadExams();
    this.setupQuestionTypeListener();

    // Handle examId from query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['examId']) {
        const examId = +params['examId'];
        this.selectedExamId = examId;
        this.loadQuestions();
      }
    });
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  setupQuestionTypeListener() {
    this.questionForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === QuestionType.TrueFalse) {
        // Clear existing options
        while (this.options.length) {
          this.options.removeAt(0);
        }
        // Add True/False options
        this.options.push(this.fb.control('True'));
        this.options.push(this.fb.control('False'));
        // Set default correct answer
        this.questionForm.patchValue({ correctAnswer: 'True' });
      } else if (type === QuestionType.MultipleChoice) {
        // Clear existing options
        while (this.options.length) {
          this.options.removeAt(0);
        }
        // Add default multiple choice options
        this.addOption();
        this.addOption();
        // this.addOption();
        // this.addOption();
      }
    });
  }

  addOption() {
    if (this.questionForm.get('type')?.value === QuestionType.MultipleChoice) {
      this.options.push(this.fb.control('', Validators.required));
    }
  }

  removeOption(index: number) {
    if (
      this.questionForm.get('type')?.value === QuestionType.MultipleChoice &&
      this.options.length > 2
    ) {
      this.options.removeAt(index);
    }
  }

  loadExams() {
    this.exams = this.examService.getExams();
    this.examMap = new Map(this.exams.map((exam) => [exam.id, exam.name]));
    this.filterExams();
  }

  filterExams() {
    if (this.selectedExamType) {
      this.filteredExams = this.exams.filter(
        (exam) => exam.type === this.selectedExamType
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
      !this.filteredExams.find((exam) => exam.id === this.selectedExamId)
    ) {
      this.selectedExamId = null;
      this.questions = [];
    }
  }

  getSelectedExamType(): string {
    if (!this.selectedExamId) return '';
    const exam = this.exams.find((e) => e.id === this.selectedExamId);
    return exam ? exam.type : '';
  }

  getExamName(examId: number): string {
    return this.examMap.get(examId) || 'Unknown Exam';
  }

  loadQuestions() {
    console.log('Loading questions for exam:', this.selectedExamId); // Debug log
    if (this.selectedExamId) {
      this.questions = this.questionService.getQuestionsByExamId(
        this.selectedExamId
      );
      console.log('Loaded questions:', this.questions); // Debug log
    } else {
      this.questions = [];
    }
  }

  getQuestionTypeCount(type: QuestionType): number {
    return this.questions.filter((q) => q.type === type).length;
  }

  onExamChange(examId: number | null) {
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
      points: 1,
      examId: this.selectedExamId,
    });

    if (question) {
      this.questionForm.patchValue({
        text: question.text,
        type: question.type,
        difficulty: question.difficulty,
        points: question.points,
        correctAnswer: question.correctAnswer,
      });

      // Set up options based on question type
      if (question.type === QuestionType.MultipleChoice && question.options) {
        // Clear existing options first
        while (this.options.length) {
          this.options.removeAt(0);
        }
        // Add options from the question
        question.options.forEach((option) => {
          this.options.push(this.fb.control(option, Validators.required));
        });
      } else if (question.type === QuestionType.TrueFalse) {
        // Clear existing options
        while (this.options.length) {
          this.options.removeAt(0);
        }
        // Add True/False options
        this.options.push(this.fb.control('True'));
        this.options.push(this.fb.control('False'));
      }
    } else {
      // For new questions, set default exam if one is selected
      if (this.selectedExamId) {
        this.questionForm.patchValue({ examId: this.selectedExamId });
      }
      // Initialize with default multiple choice options
      this.addOption();
      this.addOption();
      // this.addOption();
      // this.addOption();
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
        id: this.selectedQuestion?.id || 0,
        examId: formValue.examId,
        text: formValue.text,
        type: formValue.type,
        difficulty: formValue.difficulty,
        points: formValue.points,
        options:
          formValue.type === QuestionType.MultipleChoice
            ? formValue.options
            : ['True', 'False'],
        correctAnswer: formValue.correctAnswer,
      };

      if (this.selectedQuestion) {
        this.questionService.updateQuestion(questionData);
        this.successMessage = 'Question updated successfully!';
      } else {
        this.questionService.addQuestion(questionData);
        this.successMessage = 'Question added successfully!';
      }

      this.closeModal();
      this.loadQuestions();
      this.clearMessages();
    }
  }

  editQuestion(question: Question) {
    this.selectedQuestion = question;
    this.questionForm.patchValue(question);
    this.showModal = true;
    this.clearMessages();
  }

  deleteQuestion(id: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        this.questionService.deleteQuestion(id);
        this.loadQuestions();
        this.successMessage = 'Question deleted successfully!';
      } catch (error) {
        this.errorMessage = 'Failed to delete the question. Please try again.';
        console.error('Error deleting question:', error);
      }
    }
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
