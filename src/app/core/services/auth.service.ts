import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-url.com/api/auth/login'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const loginRequest = { email, password };
    return this.http.post<any>(this.apiUrl, loginRequest);
  }
}
