import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IProfile } from '../models/iprofile';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_Url = "http://localhost:8080/api/users/profile"
  private readonly Get_API_Url_Image = "http://localhost:8080/location"
  private readonly API_Url_Image = "http://localhost:8080/api/users/set-image"

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<IProfile> {
    return this.http.get<any>(this.API_Url).pipe(
      map(response => {
        console.log('Raw API Response:', response);
        return {
          id: response.userId || "",
          name: response.name || '',
          email: response.email || '',
          phone: response.phone || '',
          address: {
            street: response.location?.street || '',
            city: response.location?.city || '',
            country: response.location?.country || ''
          },
          image: response.image || ''
        };
      }),
      catchError(error => {
        console.error('Get User Profile Error:', error);
        return of({ id: "", name: '', email: '', phone: '', address: { street: '', city: '', country: '' }, image: '' });
      })
    );
  }

  updateUserProfile(profileData: Partial<IProfile>): Observable<IProfile> {
    const dataToSend = {
      name: profileData.name,
      phoneNumber: profileData.phone,
      email: profileData.email,
      address: profileData.address
    };
    return this.http.patch<any>(this.API_Url, dataToSend).pipe(
      map(response => {
        console.log('Update Profile Response:', response);
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        return {
          id: response.user?.userId || "",
          name: response.user?.name || '',
          email: response.user?.email || '',
          phone: response.user?.phone || '',
          address: {
            street: response.user?.location?.street || '',
            city: response.user?.location?.city || '',
            country: response.user?.location?.country || ''
          },
          image: response.user?.image || ''
        } as IProfile;
      }),
      catchError(error => {
        console.error('Update Profile Error:', error);
        return of({ id: "", name: '', email: '', phone: '', address: { street: '', city: '', country: '' }, image: '' });
      })
    );
  }

  updateUserImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image, image.name);

    const headers = new HttpHeaders({
    });

    return this.http.put(this.API_Url_Image, formData, { headers }).pipe(
      map(response => {
        console.log('Update Image Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Update Image Error:', error);
        throw error;
      })
    );
  }

  getImage(name: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.Get_API_Url_Image}/${name}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      map(blob => URL.createObjectURL(blob))
    );
  }
}
