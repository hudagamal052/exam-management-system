import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserExamsService } from '../../services/user-exams.service';
import { CurrentExam, Question, ExamAnswer } from '../../models/exam-types';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface AnswerOption {
  id: string;
  answer: string;
}

@Component({
  selector: 'app-exam-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-questions.component.html',
  styleUrl: './exam-questions.component.css'
})
export class ExamQuestionsComponent implements OnInit, OnDestroy {
  exam: CurrentExam | null = null;
  currentQuestionIndex = 0;
  answers: Map<string, string[]> = new Map();
  loading = true;
  error: string | null = null;
  timeRemaining: number = 0;
  private timerSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userExamsService: UserExamsService
  ) { }

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      this.loadExam(examId);
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadExam(examId: string): void {
    this.loading = true;
    this.error = null;

    this.userExamsService.getExamById(examId).subscribe({
      next: (exam) => {
        if (exam) {
          this.exam = exam;
          console.log(this.exam);
          this.initializeTimer();
        } else {
          this.error = 'Exam not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load exam. Please try again later.';
        this.loading = false;
        console.error('Error loading exam:', err);
      }
    });
  }

  initializeTimer(): void {
    if (!this.exam) return;

    // Parse duration from "HH:mm:ss" format
    const [hours, minutes, seconds] = this.exam.duration.split(':').map(Number);
    this.timeRemaining = (hours * 3600) + (minutes * 60) + seconds;

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeRemaining <= 0) {
        this.submitExam();
        return;
      }
      this.timeRemaining--;
    });
  }

  get currentQuestion(): Question | null {
    if (!this.exam || !this.exam.questionDto.length) return null;
    return this.exam.questionDto[this.currentQuestionIndex];
  }

  get allQuestions(): Question[] {
    return this.exam?.questionDto || [];
  }

  get isTrueFalse(): boolean {
    return this.currentQuestion?.type === 'TRUE_FALSE';
  }

  get isMultipleChoice(): boolean {
    return this.currentQuestion?.type === 'MULTIPLE_CHOICE';
  }

  get isMSQ(): boolean {
    return this.currentQuestion?.type === 'MSQ';
  }

  get allChoices(): AnswerOption[] {
    if (!this.currentQuestion) return [];
    
    if (this.isTrueFalse) {
      return [
        { id: 'true', answer: 'True' },
        { id: 'false', answer: 'False' }
      ];
    }
    
    // For MULTIPLE_CHOICE and MSQ, combine wrong and right answers
    const allAnswers = [...this.currentQuestion.wrongAnswer];
    if (this.currentQuestion.rightAnswer) {
      allAnswers.push(...this.currentQuestion.rightAnswer);
    }
    return allAnswers;
  }

  selectAnswer(answerId: string): void {
    if (!this.currentQuestion) return;

    if (this.isTrueFalse || this.isMultipleChoice) {
      this.answers.set(this.currentQuestion.questionId, [answerId]);
    } else if (this.isMSQ) {
      const currentAnswers = this.answers.get(this.currentQuestion.questionId) || [];
      const index = currentAnswers.indexOf(answerId);
      
      if (index === -1) {
        currentAnswers.push(answerId);
      } else {
        currentAnswers.splice(index, 1);
      }
      
      this.answers.set(this.currentQuestion.questionId, currentAnswers);
    }
  }

  isAnswerSelected(answerId: string): boolean {
    if (!this.currentQuestion) return false;
    const answers = this.answers.get(this.currentQuestion.questionId) || [];
    return answers.includes(answerId);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.allQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitExam(): void {
    if (!this.exam) return;

    const answers: ExamAnswer[] = Array.from(this.answers.entries()).map(([questionId, answerIds]) => {
      const question = this.exam?.questionDto.find(q => q.questionId === questionId);
      
      if (question?.type === 'TRUE_FALSE') {
        return {
          questionId,
          booleanAnswer: answerIds[0] === 'true'
        };
      } else {
        return {
          questionId,
          answerId: answerIds[0] // For MULTIPLE_CHOICE and MSQ
        };
      }
    });

    this.userExamsService.submitExamAnswers(this.exam.examId, answers).subscribe({
      next: () => {
        console.log(answers);
        this.router.navigate(['/homeStudent/exams']);
      },
      error: (err) => {
        this.error = 'Failed to submit exam. Please try again.';
        console.error('Error submitting exam:', err);
      }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}