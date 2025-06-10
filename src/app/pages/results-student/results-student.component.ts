import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISubjectGrades } from '../../models/isubject-grades';
import { SubjectGradesCardComponent } from '../../shared/subject-grades-card/subject-grades-card.component';

@Component({
  selector: 'app-results-student',
  standalone: true,
  imports: [CommonModule, SubjectGradesCardComponent],
  templateUrl: './results-student.component.html',
  styleUrl: './results-student.component.css'
})
export class ResultsStudentComponent {
  subjects: ISubjectGrades[] = [
    {
      id: 1,
      subjectName: 'Mathematics',
      grades: {
        quiz: 7,
        midterm: 15,
        final: 45.5,
      }
    },
    {
      id: 2,
      subjectName: 'Science',
      grades: {
        quiz: 8,
        midterm: undefined,
        final: 46,
      }
    },
    {
      id: 3,
      subjectName: 'History',
      grades: {
        quiz: undefined,
        midterm: 7.5,
        final: undefined
      }
    },
    {
      id: 4,
      subjectName: 'English',
      grades: {
        quiz: 9,
        midterm: undefined,
        final: 47,
      }
    },
    {
      id: 5,
      subjectName: 'Physics',
      grades: {
        quiz: 6,
        midterm: 14,
        final: 44.5,
      }
    },
    {
      id: 6,
      subjectName: 'Chemistry',
      grades: {
        quiz: 7,
        midterm: 15,
        final: 45.5,
      }
    },
    {
      id: 7,
      subjectName: 'Biology',
      grades: {
        quiz: 8,
        midterm: 16,
        final: 46,
      }
    },
    {
      id: 8,
      subjectName: 'Geography',
      grades: {
        quiz: 7,
        midterm: 15,
        final: 30,
      }
    },
    {
      id: 9,
      subjectName: 'Computer Science',
      grades: {
        quiz: 8,
        midterm: 16,
        final: 36,
      }
    },
    {
      id: 10,
      subjectName: 'Art',
      grades: {
        quiz: 7,
        midterm: 15,
        final: 25.5,
      }
    },
    {
      id: 11,
      subjectName: 'Music',
      grades: {
        quiz: 8,
        midterm: 16,
        final: 16,
      }
    }
  ];
}
