import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly token_key = 'auth_token';
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: {email: string, password: string}) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        localStorage.setItem('email', response.email);
        localStorage.setItem('role', response.role);
      })
    );
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
    this.router.navigate(['/login']);
  }
}
