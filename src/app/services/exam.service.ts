import { Injectable } from '@angular/core';
import { Exam, ExamStatus, ExamType } from '../models/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private exams: Exam[] = [
    { 
      id: 1, 
      name: 'Math 101', 
      type: ExamType.Quiz1,
      date: '2025-06-01', 
      status: ExamStatus.Active 
    },
    {
      id: 2,
      name: 'Science 102',
      type: ExamType.Midterm,
      date: '2025-06-05',
      status: ExamStatus.Scheduled,
    },
    {
      id: 3,
      name: 'History 201',
      type: ExamType.Final,
      date: '2025-05-20',
      status: ExamStatus.Completed,
    },
    {
      id: 4,
      name: 'English 103',
      type: ExamType.Quiz2,
      date: '2025-06-10',
      status: ExamStatus.Scheduled,
    },
    {
      id: 5,
      name: 'Physics 202',
      type: ExamType.Midterm,
      date: '2025-06-15',
      status: ExamStatus.Active,
    },
    {
      id: 6,
      name: 'Chemistry 104',
      type: ExamType.Final,
      date: '2025-05-25',
      status: ExamStatus.Completed,
    },
    {
      id: 7,
      name: 'Biology 105',
      type: ExamType.Quiz1,
      date: '2025-06-20',
      status: ExamStatus.Scheduled,
    },
    {
      id: 8,
      name: 'Math 102',
      type: ExamType.Final,
      date: '2025-05-30',
      status: ExamStatus.Completed,
    },
  ];

  getExams(): Exam[] {
    return this.exams;
  }

  addExam(exam: Exam) {
    exam.id = this.exams.length + 1;
    this.exams.push(exam);
  }

  updateExam(updatedExam: Exam) {
    const index = this.exams.findIndex((exam) => exam.id === updatedExam.id);
    if (index !== -1) {
      this.exams[index] = updatedExam;
    }
  }

  deleteExam(id: number) {
    this.exams = this.exams.filter((exam) => exam.id !== id);
  }
}
