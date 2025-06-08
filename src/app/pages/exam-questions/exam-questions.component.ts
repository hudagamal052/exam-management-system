import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { IQuestion } from '../../models/iquestion';
import { IAnswer } from '../../models/ianswer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-questions.component.html',
  styleUrl: './exam-questions.component.css'
})
export class ExamQuestionsComponent implements OnInit, OnDestroy {
  examId: number | null = null;
  duration: number = 20;
  timeRemaining: number = 0;
  timerSubscription: Subscription | null = null;
  showConfirmModal: boolean = false;
  isTimerEnded: boolean = false;

  questions: IQuestion[] = [
    {
      id: 1,
      text: 'What is 2 + 2?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4'
    },
    {
      id: 2,
      text: 'The Earth is flat.',
      type: 'true-false',
      correctAnswer: false
    },
    {
      id: 3,
      text: 'Which planet is known as the Red Planet?',
      type: 'multiple-choice',
      options: ['Jupiter', 'Mars', 'Venus', 'Mercury'],
      correctAnswer: 'Mars'
    }
  ];

  answers: IAnswer[] = [];
  currentQuestionIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.examId = +this.route.snapshot.paramMap.get('id')!;
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['duration']) {
      this.duration = navigation.extras.state['duration'];
    }

    this.answers = this.questions.map(q => ({
      questionId: q.id,
      selectedAnswer: null
    }));

    this.timeRemaining = this.duration * 60;
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.isTimerEnded = true;
        this.submitExam();
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  selectAnswer(questionId: number, answer: string | boolean) {
    const answerEntry = this.answers.find(a => a.questionId === questionId);
    if (answerEntry) {
      answerEntry.selectedAnswer = answer;
    }
  }

  getSelectedAnswer(questionId: number): string | boolean | null {
    const answerEntry = this.answers.find(a => a.questionId === questionId);
    return answerEntry ? answerEntry.selectedAnswer : null;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  confirmSubmit() {
    this.showConfirmModal = true;
  }

  onConfirmSubmit() {
    this.showConfirmModal = false;
    this.submitExam();
  }

  onCancelSubmit() {
    this.showConfirmModal = false;
  }

  submitExam() {
    console.log('Exam Answers:', this.answers);

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    setTimeout(() => {
      alert('Exam submitted successfully!');
      this.router.navigate(['/homeStudent/exams']);
    }, 1000);
  }
}