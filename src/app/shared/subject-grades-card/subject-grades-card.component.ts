import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ISubjectGrades } from '../../models/isubject-grades';

@Component({
  selector: 'app-subject-grades-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-grades-card.component.html',
  styleUrl: './subject-grades-card.component.css'
})
export class SubjectGradesCardComponent {
  @Input() subject: ISubjectGrades | null = null;

  getGradeStyle(grade: number | undefined, max: number): string {
    if (grade == undefined) return '';
    const scaledGrade = Math.min(grade, max);
    const percentage = (scaledGrade / max) * 100;
    if (percentage >= 75) return 'text-green-700 font-bold dark:text-green-400';
    if (percentage >= 50) return 'text-blue-500 font-bold dark:text-blue-400';
    return 'text-red-600 font-bold dark:text-red-500';
  }
}
