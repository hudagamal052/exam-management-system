export interface INotifications {
    id: number;
    subject: string;
    examType: 'quiz' | 'midterm' | 'final';
    dateTime: string;
    endDateTime: string;
}
