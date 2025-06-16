export enum QuestionType {
  MultipleChoice = 'MULTIPLE_CHOICE',
  TrueFalse = 'TRUE_FALSE',
}

export enum QuestionDifficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Question {
  questionId: string;
  type: string;
  text: string;
  marks: number;
  isRight: boolean;
  wrongAnswer: {id: string , answer:string}[];
  rightAnswer: {id: string , answer:string}[];
  createdAt?: string;
  updatedAt?: string;
  // Additional fields for UI compatibility
  difficulty?: QuestionDifficulty;
  examId: string;
}
