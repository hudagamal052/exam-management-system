import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentDetails } from '../../models/student-details';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private readonly API_URL = 'http://localhost:8080/api';
  constructor(private http:HttpClient) {
  }

  getResultDetails(email:string){
    return this.http.get<StudentDetails>(`${this.API_URL}/teachers/users/result?email=${email}`)
  }
}
