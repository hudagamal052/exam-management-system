export enum QuestionType {
  MultipleChoice = 'Multiple Choice',
  TrueFalse = 'True/False',
}

export enum QuestionDifficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  points: number;
  examId: number;
  options?: string[];
  correctAnswer: string;
}
