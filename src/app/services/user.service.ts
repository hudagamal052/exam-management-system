import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProfile } from '../models/iprofile';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_Url = "http://10.177.240.94:8080/users"
  private readonly API_Url_Image = "http://10.177.240.28:8080/api/users/set-image"

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  
  getUserProfile(id: string): Observable<IProfile> {
    return this.http.get<any>(`${this.API_Url}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => ({
        id: response.id || "1",
        name: response.name,
        email: response.email,
        phone: response.phone,
        address: {
          street: response.address?.street,
          city: response.address?.city,
          country: response.address?.country
        },
        image: response.image
      }))
    );
  }

  updateUserProfile(id: string, profileData: Partial<IProfile>): Observable<IProfile> {
    return this.http.patch<IProfile>(`${this.API_Url}/${id}`, profileData, { headers: this.getAuthHeaders() });
  }

  updateUserImage(id: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    const headers = this.getAuthHeaders();
    headers.delete('Content-Type');
    return this.http.patch(`${this.API_Url_Image}/${id}`, formData, { headers });
  }
  /* getUserProfile(id: string): Observable<IProfile> {
    return this.http.get<any>(`${this.API_Url}/${id}`).pipe(
      map(response => ({
        id: response.id || "1",
        name: response.name,
        email: response.email,
        phone: response.phone,
        address: {
          street: response.address?.street,
          city: response.address?.city,
          country: response.address?.country
        },
        image: response.image
      }))
    );
  }

  updateUserProfile(id: string, profileData: Partial<IProfile>): Observable<IProfile> {
    return this.http.patch<IProfile>(`${this.API_Url}/${id}`, profileData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateUserImage(id: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.patch(`${this.API_Url_Image}/${id}`, formData);
  } */
}
