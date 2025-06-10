import { Injectable } from '@angular/core';
import { Question, QuestionType, QuestionDifficulty } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private questions: Question[] = [
    {
      id: 1,
      text: 'What is the capital of France?',
      type: QuestionType.MultipleChoice,
      difficulty: QuestionDifficulty.Easy,
      points: 2,
      examId: 1,
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
    },
    {
      id: 2,
      text: 'The Earth is flat.',
      type: QuestionType.TrueFalse,
      difficulty: QuestionDifficulty.Easy,
      points: 1,
      examId: 1,
      correctAnswer: 'False',
    },
    {
      id: 3,
      text: 'Explain the concept of photosynthesis.',
      type: QuestionType.MultipleChoice,
      difficulty: QuestionDifficulty.Hard,
      points: 5,
      examId: 1,
      correctAnswer:
        'Photosynthesis is the process by which plants convert light energy into chemical energy.',
    },
  ];

  getQuestions(): Question[] {
    return this.questions;
  }

  getQuestionsByExamId(examId: number): Question[] {
    return this.questions.filter((question) => question.examId === examId);
  }

  getQuestionById(id: number): Question | undefined {
    return this.questions.find((question) => question.id === id);
  }

  addQuestion(question: Question): void {
    question.id = this.questions.length + 1;
    this.questions.push(question);
  }

  updateQuestion(updatedQuestion: Question): void {
    const index = this.questions.findIndex((q) => q.id === updatedQuestion.id);
    if (index !== -1) {
      this.questions[index] = updatedQuestion;
    }
  }

  deleteQuestion(id: number): void {
    this.questions = this.questions.filter((question) => question.id !== id);
  }
}
