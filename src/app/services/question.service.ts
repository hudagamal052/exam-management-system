import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Question, QuestionType, QuestionDifficulty } from '../models/question';
import { AuthenticationService } from './authentication.service';

// Interface for the API request structure
interface QuestionApiRequest {
  questions: QuestionRequest[];
  examId: string;
}

// Interface for question request payload (without questionId)
interface QuestionRequest {
  type: string;
  text: string;
  marks: number;
  isRight: boolean;
  wrongAnswer: {id: string , answer:string}[];
  rightAnswer: {id: string , answer:string}[];
  difficulty?: QuestionDifficulty;
  examId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  // private readonly API_URL = 'http://10.177.240.62:8080/api/teachers/questions';
  private readonly API_URL = 'http://localhost:8080/api/teachers/questions';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.API_URL).pipe(
      catchError(error => {
        console.error('Error fetching questions:', error);
        return of([]); // Return empty array on error
      })
    );
  }

  getQuestionsByExamId(examId: string): Observable<Question[]> {
    if (!examId || examId.trim() === '') {
      console.error('Invalid examId provided:', examId);
      return of([]);
    }
    
    const url = `${this.API_URL}/${examId}`;
    console.log('Fetching questions for exam ID:', examId);
    
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    return this.http.get<Question[]>(url, options).pipe(
      map(response => {
        console.log('Fetched questions:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching questions by exam ID:', error);
        return of([]);
      })
    );
  }
  // getQuestionById(questionId: string): Observable<Question | undefined> {
  //   return this.http.get<Question>(`${this.API_URL}/${questionId}`).pipe(
  //     catchError(error => {
  //       console.error('Error fetching question by ID:', error);
  //       return of(undefined); // Return undefined on error
  //     })
  //   );
  // }
  addQuestion(question: Question): Observable<Question> {
    // Create question request without questionId
    const questionRequest: QuestionRequest = {
      type: question.type,
      text: question.text,
      marks: question.marks,
      isRight: question.isRight,
      wrongAnswer: question.wrongAnswer,
      rightAnswer: question.rightAnswer,
      difficulty: question.difficulty,
      examId: question.examId
    };

    const apiRequest: QuestionApiRequest = {
      questions: [questionRequest],
      examId: question.examId || ''
    };
    console.log('API Request being sent:', apiRequest);
    
    // Use responseType: 'text' to handle plain text responses
    return this.http.post(this.API_URL, apiRequest, { responseType: 'text' }).pipe(
      map(response => {
        console.log('API Response:', response);
        // Return the original question object since the API doesn't return the created question
        return question;
      })
    );
  }

  updateQuestion(updatedQuestion: Question): Observable<Question> {
    // Create question request with questionId
    const questionRequest = {
      questionId: updatedQuestion.questionId,
      type: updatedQuestion.type,
      text: updatedQuestion.text,
      marks: updatedQuestion.marks,
      wrongAnswer: updatedQuestion.wrongAnswer,
      rightAnswer: updatedQuestion.rightAnswer,
      difficulty: updatedQuestion.difficulty,
      isRight: updatedQuestion.isRight
    };

    console.log('Update request data:', questionRequest);
    
    return this.http.put(`${this.API_URL}/${updatedQuestion.questionId}`, questionRequest).pipe(
      map(response => {
        console.log('Update response:', response);
        // Return the updated question with all fields
        return {
          ...updatedQuestion,
          difficulty: updatedQuestion.difficulty
        };
      })
    );
  }

  deleteQuestion(questionId: string): Observable<void> {
    // Validate questionId
    if (!questionId || questionId.trim() === '') {
      console.error('Invalid questionId provided:', questionId);
      return of();
    }
    
    // Check authentication
    const isLoggedIn = this.authenticationService.isLoggedIn();
    const token = this.authenticationService.getToken();
    console.log('Delete authentication status:', {
      isLoggedIn: isLoggedIn,
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });
    
    // Try different delete approaches since the API might expect different formats
    const url = `${this.API_URL}/${questionId}`;
    const deleteData = { questionId: questionId };
    
    console.log('Attempting to delete question with ID:', questionId);
    console.log('Delete URL:', url);
    console.log('Delete data:', deleteData);
    console.log('Question ID type:', typeof questionId);
    console.log('Question ID value:', questionId);
    
    // Add headers to ensure proper authentication
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      responseType: 'text' as const
    };
    
    return this.http.delete(url, options).pipe(
      map(response => {
        console.log('Delete API Response:', response);
        console.log('Delete response type:', typeof response);
        console.log('Delete response length:', response ? response.length : 0);
        // Return void since delete operations don't need to return data
        return;
      }),
      catchError(error => {
        console.error('Error deleting question:', error);
        console.error('Delete error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: url,
          deleteData: deleteData,
          questionId: questionId,
          questionIdType: typeof questionId,
          headers: error.headers,
          error: error.error,
          isLoggedIn: isLoggedIn,
          hasToken: !!token
        });
        throw error; // Re-throw the error so the component can handle it
      })
    );
  }

  // Helper method to get display type from API type
  getDisplayType(apiType: string): string {
    switch (apiType.toUpperCase()) {
      case 'MULTIPLE_CHOICE':
        return 'Multiple Choice';
      case 'TRUE_FALSE':
        return 'True/False';
      default:
        return apiType;
    }
  }

  // Helper method to get all options (wrong + right answers)
  getAllOptions(question: Question): {id:string, answer:string}[] {
    return [...question.wrongAnswer, ...question.rightAnswer];
  }

  // Helper method to get correct answer display
  getCorrectAnswerDisplay(question: Question): string {
    return question.rightAnswer.join(', ');
  }
}
