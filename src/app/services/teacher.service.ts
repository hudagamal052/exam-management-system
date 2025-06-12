import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/user';
import { UpdateTeacherProfile, UpdateTeacherResponse } from '../models/update-teacher-profile';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly API_URL= "http://10.177.240.78:8080/api/teachers"

  constructor(private http:HttpClient) { }
  getTeacherProfile(){
    return this.http.get<Teacher>(`${this.API_URL}/profile`);
  }

  updateTeacherProfile(updates: UpdateTeacherProfile){
    return this.http.patch<UpdateTeacherResponse>(`${this.API_URL}/profile`, updates);
  }
}
