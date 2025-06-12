import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/user';
import { UpdateTeacherProfile, UpdateTeacherResponse } from '../models/update-teacher-profile';
import { map } from 'rxjs/operators';
import { Adduser } from '../models/adduser';


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

}
