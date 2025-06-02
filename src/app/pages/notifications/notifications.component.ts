import { Component } from '@angular/core';
import { INotifications } from '../../models/inotifications';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications: INotifications[] = [
    { id: 1, subject: 'Mathematics', examType: 'midterm', dateTime: '2025-05-30 10:00', endDateTime: '2025-05-30 11:00' },
    { id: 2, subject: 'Physics', examType: 'quiz', dateTime: '2025-05-30 15:00', endDateTime: '2025-05-30 16:00' },
    { id: 3, subject: 'Arabic', examType: 'midterm', dateTime: '2025-06-02 10:00', endDateTime: '2025-06-02 11:00' },
    { id: 4, subject: 'French', examType: 'quiz', dateTime: '2025-06-02 15:00', endDateTime: '2025-06-02 18:00' },
    { id: 5, subject: 'Chemistry', examType: 'final', dateTime: '2025-06-03 09:00', endDateTime: '2025-06-03 10:00' },
    { id: 6, subject: 'Biology', examType: 'midterm', dateTime: '2025-06-03 14:00', endDateTime: '2025-06-03 15:00' },
    { id: 7, subject: 'English', examType: 'quiz', dateTime: '2025-06-04 10:00', endDateTime: '2025-06-04 11:00' },
    { id: 8, subject: 'History', examType: 'final', dateTime: '2025-06-04 15:00', endDateTime: '2025-06-04 16:00' },
    { id: 9, subject: 'Geography', examType: 'midterm', dateTime: '2025-06-05 10:00', endDateTime: '2025-06-05 11:00' },
    { id: 10, subject: 'Art', examType: 'quiz', dateTime: '2025-06-05 15:00', endDateTime: '2025-06-05 16:00' },
    { id: 11, subject: 'Music', examType: 'final', dateTime: '2025-06-06 10:00', endDateTime: '2025-06-06 11:00' },
    { id: 12, subject: 'Computer Science', examType: 'midterm', dateTime: '2025-06-06 15:00', endDateTime: '2025-06-06 16:00' }
  ];

  currentDateTime: Date = new Date();

  constructor() { }

  getExamStatus(dateTime: string, endDateTime: string): 'past' | 'present' | 'future' {
    const start = new Date(dateTime.replace(' ', 'T') + '+03:00');
    const end = new Date(endDateTime.replace(' ', 'T') + '+03:00');
    if (this.currentDateTime > end) return 'past';
    if (this.currentDateTime >= start && this.currentDateTime <= end) return 'present';
    return 'future';
  }

  isExamActive(dateTime: string, endDateTime: string): boolean {
    const start = new Date(dateTime.replace(' ', 'T') + '+03:00');
    const end = new Date(endDateTime.replace(' ', 'T') + '+03:00');
    return this.currentDateTime >= start && this.currentDateTime <= end;
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime.replace(' ', 'T') + '+03:00');
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}
