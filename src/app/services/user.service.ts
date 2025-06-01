import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // Adjust for your backend

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    // Mock data for demo; replace with API call
    return of({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      studentId: '123456',
      phone: '+1234567890',
      profileImage: null
    });
    // return this.http.get(`${this.apiUrl}/current`);
  }

  updateUser(user: any): Observable<any> {
    // Mock update; replace with API call
    return of(user);
    // return this.http.put(`${this.apiUrl}/current`, user);
  }
}
