export interface UserExam {
    subject: string;
    title: string;
    examType: string;
    marks: number;
    obtainedMarks?: number;
    startDate: string;
    endDate: string;
    examId: string;
    status?: 'PASSED' | 'FAILED';
}

export interface Answer {
    id: string;
    answer: string;
}

export interface Question {
    questionId: string;
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MSQ';
    text: string;
    marks: number;
    isRight: boolean;
    wrongAnswer: Answer[];
    rightAnswer: Answer[];
    createdAt: string;
    updatedAt: string;
}

export interface CurrentExam {
    subject: string;
    title: string;
    examType: 'Quiz1' | 'Quiz2' | 'Midterm' | 'Final';
    marks: number;
    questionDto: Question[];
    startDate: string;
    endDate: string;
    duration: string;
    examId: string;
}

export interface PastExam {
    examId: string;
    studentId: string;
    examTitle: string;
    examType: string;
    marks: number;
    status: string;
    startTime: string;
    endTime: string;
    score: number;
    duration: string;
}

export interface UserExams {
    pastExams: PastExam[];
    currentExams: CurrentExam[];
    upComingExams: CurrentExam[];
}

export interface ExamAnswer {
    questionId: string;
    answerId?: string;
    booleanAnswer?: boolean;
}