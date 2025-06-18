import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher, User } from '../models/user';
import { UpdateTeacherProfile, UpdateTeacherResponse } from '../models/update-teacher-profile';
import { map } from 'rxjs/operators';
import { Adduser } from '../models/adduser';
import { UserState } from '../models/user-state';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly API_URL= "http://localhost:8080/api/teachers"

  constructor(private http:HttpClient) { }
  getTeacherProfile(){
    return this.http.get<Teacher>(`${this.API_URL}/profile`);
  }

  updateTeacherProfile(updates: UpdateTeacherProfile){
    return this.http.patch<UpdateTeacherResponse>(`${this.API_URL}/profile`, updates);
  }

  updateProfileImage(selectedFile: File){
    const formData = new FormData();
    formData.append("image", selectedFile); 
    return this.http.put<Teacher>(`${this.API_URL}/profile/image`, formData);
  }

  getImage(name:string) { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`http://localhost:8080/location/${name}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      map(blob => URL.createObjectURL(blob))
    );
  }

  addStudent(user:Adduser)
  {
    return this.http.post<any>(`${this.API_URL}/student/add`, user);
  }
  getUserById(id:string){
    return this.http.get<User>(`${this.API_URL}/users/${id}`)
  }

  updateUser(id:string, updateUser : {name:string, email:string, phone:string, address?: {city?: string, street?:string, country?: string}}) {
    return this.http.patch<User>(`${this.API_URL}/user/${id}`, updateUser);
  }
}
