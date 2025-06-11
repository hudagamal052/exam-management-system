import { ExamAttempts } from "./exam-attempts";

export interface StudentDetails {
    name:string;
    email:string;
    totalScore:number;
    exams_t: ExamAttempts[];
}
