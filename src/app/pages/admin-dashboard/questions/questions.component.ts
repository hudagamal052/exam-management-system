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
      wrongAnswers: this.fb.array([]),
      rightAnswers: this.fb.array([]),
      isRight: [true],
    });
  }

  ngOnInit() {
    this.loadExams();
    this.setupQuestionTypeListener();

    this.route.queryParams.subscribe((params) => {
      if (params['examId']) {
        const examId = params['examId'];
        this.selectedExamId = examId;
        this.loadQuestions();
      }
    });
  }

  get wrongAnswers() {
    return this.questionForm.get('wrongAnswers') as FormArray;
  }

  get rightAnswers() {
    return this.questionForm.get('rightAnswers') as FormArray;
  }

  setupQuestionTypeListener() {
    this.questionForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === QuestionType.TrueFalse) {
        this.clearAnswers();
        this.addWrongAnswer('False');
        this.addRightAnswer('True');
      } else if (type === QuestionType.MultipleChoice) {
        this.clearAnswers();
        this.addWrongAnswer('');
        this.addWrongAnswer('');
        this.addRightAnswer('');
      }
    });
  }

  clearAnswers() {
    while (this.wrongAnswers.length) {
      this.wrongAnswers.removeAt(0);
    }
    while (this.rightAnswers.length) {
      this.rightAnswers.removeAt(0);
    }
  }

  addWrongAnswer(value: string = '') {
    if (this.questionForm.get('type')?.value === QuestionType.MultipleChoice) {
      this.wrongAnswers.push(this.fb.group({
        id: [this.generateId()],
        answer: [value, Validators.required]
      }));
    }
  }

  addRightAnswer(value: string = '') {
    if (this.questionForm.get('type')?.value === QuestionType.MultipleChoice) {
      this.rightAnswers.push(this.fb.group({
        id: [this.generateId()],
        answer: [value, Validators.required]
      }));
    }
  }

  removeWrongAnswer(index: number) {
    if (
      this.questionForm.get('type')?.value === QuestionType.MultipleChoice &&
      this.wrongAnswers.length > 1
    ) {
      this.wrongAnswers.removeAt(index);
    }
  }

  removeRightAnswer(index: number) {
    if (
      this.questionForm.get('type')?.value === QuestionType.MultipleChoice &&
      this.rightAnswers.length > 1
    ) {
      this.rightAnswers.removeAt(index);
    }
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 9);
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
    if (this.selectedExamId) {
      this.questionService.getQuestionsByExamId(this.selectedExamId).subscribe({
        next: (questions) => {
          this.questions = questions;
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.errorMessage = 'Failed to load questions. Please try again.';
        }
      });
    } else {
      this.questions = [];
    }
  }

  getQuestionTypeCount(type: QuestionType): number {
    return this.questions.filter((q) => q.type === type).length;
  }

  onExamChange(examId: string | null) {
    this.selectedExamId = examId;
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
      this.clearAnswers();
      this.questionForm.patchValue({
        questionId: question.questionId,
        text: question.text,
        type: question.type,
        difficulty: question.difficulty || QuestionDifficulty.Medium,
        marks: question.marks,
        examId: question.examId,
        isRight: question.isRight,
      });

      if (question.type === QuestionType.MultipleChoice) {
        question.wrongAnswer.forEach((answer) => {
          this.addWrongAnswer(answer.answer);
        });
        question.rightAnswer.forEach((answer) => {
          this.addRightAnswer(answer.answer);
        });
      } else if (question.type === QuestionType.TrueFalse) {
        this.addWrongAnswer('False');
        this.addRightAnswer('True');
      }
    } else {
      if (this.selectedExamId) {
        this.questionForm.patchValue({ examId: this.selectedExamId });
      }
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
        marks: formValue.marks,
        isRight: formValue.isRight,
        wrongAnswer: formValue.wrongAnswers.map((wa: any) => ({
          id: wa.id || this.generateId(),
          answer: wa.answer
        })),
        rightAnswer: formValue.rightAnswers.map((ra: any) => ({
          id: ra.id || this.generateId(),
          answer: ra.answer
        })),
        difficulty: formValue.difficulty
      };

      console.log(`questionData: ${questionData}`);
      

      if (this.selectedQuestion) {
        questionData.questionId = this.selectedQuestion.questionId;
        this.questionService.updateQuestion(questionData).subscribe({
          next: () => {
            this.successMessage = 'Question updated successfully!';
            this.closeModal();
            this.loadQuestions();
          },
          error: (error) => {
            console.error('Error updating question:', error);
            this.errorMessage = 'Failed to update the question. Please try again.';
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
            console.error('Error adding question:', error);
            this.errorMessage = 'Failed to add the question. Please try again.';
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  editQuestion(question: Question) {
    this.selectedQuestion = question;
    this.openModal(question);
  }

  deleteQuestion(questionId: string) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.loadQuestions();
          this.successMessage = 'Question deleted successfully!';
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          this.errorMessage = 'Failed to delete the question. Please try again.';
        }
      });
    }
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}