export interface ISubjectGrades {
    id: number;
    subjectName: string;
    grades: {
        quiz?: number;
        midterm?: number;
        final?: number;
    };
}
