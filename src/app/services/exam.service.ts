import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CreateExamRequest, Exam, ExamStatus, ExamType, calculateExamStatus } from '../models/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  // private readonly API_URL = 'http://10.177.240.62:8080/api/teachers/exams';
  private readonly API_URL = 'http://localhost:8080/api/teachers/exams';
  constructor(private http: HttpClient) {}

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.API_URL).pipe(
      map(exams => exams.map(exam => ({
        ...exam,
        status: calculateExamStatus(exam)
      })))
    );
  }

  addExam(exam: CreateExamRequest): Observable<Exam> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const examData = {
      title: exam.title,
      examType: exam.examType,
      marks: exam.marks,
      startDate: exam.startDate,
      endDate: exam.endDate,
      duration: exam.duration
    };

    
    return this.http.post(this.API_URL, examData, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      map(response => {
        // Since the API returns text, we'll return the original exam object
        // The exam was successfully saved, so we can return the exam with calculated status
        return {
          ...exam,
          status: calculateExamStatus(exam)
        };
      })
    );
  }

  updateExam(updatedExam: CreateExamRequest): Observable<Exam> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Send data in the exact format expected by the API
    const examData = {
      examId: updatedExam.examId,
      title: updatedExam.title,
      examType: updatedExam.examType,
      marks: updatedExam.marks,
      startDate: updatedExam.startDate,
      endDate: updatedExam.endDate,
      duration: updatedExam.duration
    };

    return this.http.put(`${this.API_URL}`, examData, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      map(response => {
        return {
          ...updatedExam,
          status: calculateExamStatus(updatedExam)
        }; 
      })
    );
  }

  deleteExam(examId: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const deleteData = {
      examId: examId
    };

    return this.http.delete(`${this.API_URL}/${examId}`, { 
      headers,
      body: deleteData,
      responseType: 'text' 
    }).pipe(
      map(() => {
        // Return void since we don't need the response
        return;
      })
    );
  }

  getExamById(examId: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.API_URL}/${examId}`).pipe(
      map(exam => ({
        ...exam,
        status: calculateExamStatus(exam)
      }))
    );
  }
}
