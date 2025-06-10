export enum ExamStatus {
  Active = 'Active',
  Scheduled = 'Scheduled',
  Completed = 'Completed'
}

export enum ExamType {
  Quiz1 = 'Quiz 1',
  Quiz2 = 'Quiz 2',
  Midterm = 'Midterm',
  Final = 'Final'
}

export interface Exam {
  id: number;
  name: string;
  type: ExamType;
  date: string;
  status: ExamStatus;
}
