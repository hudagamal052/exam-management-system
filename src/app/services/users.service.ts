import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '../models/user-state';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_Url = "http://localhost:8080/api/teachers"
  constructor(private http: HttpClient) {
    
  }

  getAllStudentsState(){
    return this.http.get<UserState[]>(`${this.API_Url}/users`)
  }


  deleteUser(id: string){
  
    return this.http.delete<string>(
      `${this.API_Url}/users/${id}`
    );
  }
}
