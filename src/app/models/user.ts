export interface Location {
    city?: string;
    country?: string;
    street?: string;
}

export enum Role {
    TEACHER = 'Teacher',
    STUDENT = 'Student',
}

export interface Exam {
    examId?: string;
    title: string;
    examType: string;
    startDate: Date;
    endDate:  Date;
}

export interface Subject {
    subjectId?: string;
    name: string;
    level: number;
    semester: number;
}

export interface Teacher {
    userId: string;
    name: string;
    email: string;
    role: Role;
    image?: string;
    phone: string;
    isVerified: boolean;
    location?: Location;
    createdExams: Exam[];
    mySubjects: Subject[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

