export interface IQuestion {
    id: number;
    text: string;
    type: 'multiple-choice' | 'true-false';
    options?: string[];
    correctAnswer: string | boolean;
}
