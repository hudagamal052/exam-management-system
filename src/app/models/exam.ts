export enum ExamStatus {
  Active = 'Active',
  Scheduled = 'Scheduled',
  Completed = 'Completed'
}

export enum ExamType {
  Quiz1 = 'Quiz1',
  Quiz2 = 'Quiz2',
  Midterm = 'Midterm',
  Final = 'Final'
}

interface DurationUnit {
  durationEstimated: boolean;
  timeBased: boolean;
  dateBased: boolean;
}

interface Duration {
  seconds: number;
  zero: boolean;
  nano: number;
  negative: boolean;
  positive: boolean;
  units: DurationUnit[];
}

export interface Exam {
  title: string;
  examType: ExamType;
  marks: number;
  startDate: string;
  endDate: string;
  duration: Duration;
  examId: string;
  status?: ExamStatus; // Optional since we'll calculate it based on dates
}

// Helper function to calculate exam status based on dates
export function calculateExamStatus(exam: Exam): ExamStatus {
  const now = new Date();
  const startDate = new Date(exam.startDate);
  const endDate = new Date(exam.endDate);
  
  if (now < startDate) {
    return ExamStatus.Scheduled;
  } else if (now >= startDate && now <= endDate) {
    return ExamStatus.Active;
  } else {
    return ExamStatus.Completed;
  }
}

// Helper function to get duration in minutes
export function getDurationInMinutes(duration: Duration): number {
  return Math.floor(duration.seconds / 60);
}
