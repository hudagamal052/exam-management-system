import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly token_key = 'auth_token';
  private readonly API_URL = 'http://10.177.240.94:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

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
          localStorage.setItem('createdAt', response.createdAt);
          console.log('Login successful:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  resetPassword(resetData: { password: string; token: string }): Observable<any> {
    console.log('Resetting password with data:', resetData); // Debug log
    return this.http.patch(`${this.API_URL}/reset-password`, resetData, {
      responseType: 'text' // Handle non-JSON responses
    }).pipe(
      map(response => {
        try {
          return response ? JSON.parse(response) : {};
        } catch (e) {
          return response; // Return as text if not JSON
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
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
    localStorage.removeItem('createdAt');
    this.router.navigate(['/login']);
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('role');
  }

  isFirstTimeUser(): boolean {
    const isFirstTime = localStorage.getItem('isFirstTime');
    return isFirstTime === 'true';
  }
}
