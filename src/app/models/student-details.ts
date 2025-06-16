import { ExamAttempts } from "./exam-attempts";

export interface StudentDetails {
    name:string;
    email:string;
    score:number;
    totalScore:number;
    exams_t: ExamAttempts[];
}
