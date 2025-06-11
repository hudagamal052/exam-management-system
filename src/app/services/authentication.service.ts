import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest } from '../models/auth-response';
//import { IStudent } from '../models/istudent';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly token_key = 'auth_token';
  private readonly API_URL = 'http://10.177.240.62:8080/api/auth';
  //private API_URL2 = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Register a new user/student
   * @param userData - Student registration data
   * @returns Observable with registration response
   */
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }).pipe(
      tap(response => {
        console.log('Registration successful:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login user with email and password
   * @param credentials - Login credentials
   * @returns Observable with authentication response
   */
  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', response.role);
          localStorage.setItem('isFirstTime', response.isFirstTime.toString());
          console.log('Login successful:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  resetPassword(resetData: { password: string; token: string }): Observable<any> {
    console.log('Resetting password with data:', resetData); // Debug log
    return this.http.patch<string>(`${this.API_URL}/reset-password`, resetData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        console.log('Password reset successful:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @returns Observable with error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('Authentication error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  setToken(token: string): void {
    localStorage.setItem(this.token_key, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.token_key);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.token_key);
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('isFirstTime');
    this.router.navigate(['/login']);
  }

  /**
   * Get current user email from localStorage
   */
  getCurrentUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  /**
   * Get current user role from localStorage
   */
  getCurrentUserRole(): string | null {
    return localStorage.getItem('role');
  }

  /**
   * Check if current user is first time user
   */
  isFirstTimeUser(): boolean {
    const isFirstTime = localStorage.getItem('isFirstTime');
    return isFirstTime === 'true';
  }
}
