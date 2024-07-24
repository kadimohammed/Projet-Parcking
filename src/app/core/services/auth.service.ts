import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Login } from '../ViewModels/Login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7009/api/Admin/login';
  private isAuthenticated = false;
  private readonly TOKEN_KEY = 'Projet@Parking123546@2024';


  constructor(private http: HttpClient, private router: Router) { }

  loginuser(loginModel: Login): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, loginModel).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.login(response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.status === 400) {
      errorMessage = 'Email or Password Incorect !!!';
    } else {
      errorMessage = 'An unexpected error occurred';
    }
    return throwError(() => new Error(errorMessage));
  }

  login(response: any): void {
    console.log("methode login");
    this.isAuthenticated = true;
    localStorage.setItem('admin', JSON.stringify(response));
  }
  
  logout(): void {
    console.log("methode logout");
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    console.log("methode isLoggedIn");
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}