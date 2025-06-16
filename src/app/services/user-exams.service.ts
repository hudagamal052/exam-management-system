import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserExams, CurrentExam, PastExam, ExamAnswer } from '../models/exam-types';
import { ExamStatistics } from '../models/exam-statistics';

@Injectable({
    providedIn: 'root'
})
export class UserExamsService {
    private readonly API_URL = 'http://localhost:8080/api/users/exams';
    private readonly ANSWERS_URL = 'http://localhost:8080/api/users/answers';

    constructor(private http: HttpClient) {}

    /**
     * Get all exams for the current user including past, current and upcoming exams
     * @returns Observable<UserExams>
     */
    getAllExams(): Observable<UserExams> {
        return this.http.get<UserExams>(this.API_URL);
    }

    /**
     * Get past exams for the current user
     * @returns Observable<PastExam[]>
     */
    getPastExams(): Observable<PastExam[]> {
        return this.getAllExams().pipe(
            map(exams => exams.pastExams)
        );
    }

    /**
     * Get current exams for the current user
     * @returns Observable<CurrentExam[]>
     */
    getCurrentExams(): Observable<CurrentExam[]> {
        return this.getAllExams().pipe(
            map(exams => exams.currentExams)
        );
    }

    /**
     * Get upcoming exams for the current user
     * @returns Observable<CurrentExam[]>
     */
    getUpcomingExams(): Observable<CurrentExam[]> {
        return this.getAllExams().pipe(
            map(exams => exams.upComingExams)
        );
    }

    /**
     * Get a specific exam by ID
     * @param examId The ID of the exam to retrieve
     * @returns Observable<CurrentExam | undefined>
     */
    getExamById(examId: string): Observable<CurrentExam | undefined> {
        return this.http.get<CurrentExam>(`${this.API_URL}/${examId}`);
    }

    /**
     * Submit exam answers
     * @param examId The ID of the exam
     * @param answers Array of question answers
     * @returns Observable<any>
     */
    submitExamAnswers(examId: string, answers: ExamAnswer[]): Observable<any> {
        return this.http.post(`${this.ANSWERS_URL}/${examId}`, answers);
    }

    /**
     * Get exam statistics including total, passed, and failed exams
     * @returns Observable<ExamStatistics>
     */
    getExamStatistics(): Observable<ExamStatistics> {
        return this.getPastExams().pipe(
            map(exams => {
                const totalExams = exams.length;
                const passedExams = exams.filter(exam => exam.score >= exam.marks * 0.5).length;
                const failedExams = totalExams - passedExams;
                const passRate = totalExams > 0 ? (passedExams / totalExams) * 100 : 0;

                return {
                    totalExams,
                    passedExams,
                    failedExams,
                    passRate
                };
            })
        );
    }

    /**
     * Helper method to check if an exam is currently active
     * @param exam The exam to check
     * @returns boolean
     */
    isExamActive(exam: CurrentExam): boolean {
        const now = new Date();
        const startDate = new Date(exam.startDate);
        const endDate = new Date(exam.endDate);
        return now >= startDate && now <= endDate;
    }

    /**
     * Helper method to check if an exam is upcoming
     * @param exam The exam to check
     * @returns boolean
     */
    isExamUpcoming(exam: CurrentExam): boolean {
        const now = new Date();
        const startDate = new Date(exam.startDate);
        return now < startDate;
    }

    /**
     * Helper method to check if an exam has been taken
     * @param examId The ID of the exam to check
     * @returns Observable<boolean>
     */
    hasExamBeenTaken(examId: string): Observable<boolean> {
        return this.getPastExams().pipe(
            map(exams => exams.some(exam => exam.examId === examId))
        );
    }

    hasPassedExam(exam: PastExam): boolean {
        return exam.score >= exam.marks * 0.6;
    }

    getTimeRemaining(exam: CurrentExam): string {
        const now = new Date();
        const startDate = new Date(exam.startDate);
        const endDate = new Date(exam.endDate);

        if (now < startDate) {
            const timeUntilStart = Math.round((startDate.getTime() - now.getTime()) / (1000 * 60));
            if (timeUntilStart < 60) {
                return `Starts in ${timeUntilStart} minutes`;
            }
            const hours = Math.floor(timeUntilStart / 60);
            const minutes = timeUntilStart % 60;
            return `Starts in ${hours}h ${minutes}m`;
        } else if (now > endDate) {
            return 'Exam has ended';
        } else {
            const timeRemaining = Math.round((endDate.getTime() - now.getTime()) / (1000 * 60));
            if (timeRemaining < 60) {
                return `${timeRemaining} minutes remaining`;
            }
            const hours = Math.floor(timeRemaining / 60);
            const minutes = timeRemaining % 60;
            return `${hours}h ${minutes}m remaining`;
        }
    }

    formatDateTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
}
