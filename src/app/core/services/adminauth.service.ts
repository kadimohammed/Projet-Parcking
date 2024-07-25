import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Login } from '../ViewModels/Login.model';
import { ChangeProfileAdminVM } from '../ViewModels/ChangeProfileAdminVM';
import { Admin } from '../models/admin.model';
import { ChangePasswordAdminVM } from '../ViewModels/ChangePasswordAdminVM';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7009/api/Admin';
  private Token : string = 'admin';

  constructor(private http: HttpClient, private router: Router) { }

  loginuser(loginModel: Login): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, loginModel).pipe(
      tap(response => {
        this.login(response);
      }),
      catchError(this.handleError)
    );
  }

  login(response: any): void {
    localStorage.setItem(this.Token, JSON.stringify(response));
  }
  
  logout(): void {
    localStorage.removeItem(this.Token);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.Token);
  }

  setUser(admin: Admin) {
    localStorage.setItem(this.Token, JSON.stringify(admin));
  }

  getUser() {
    const user = localStorage.getItem(this.Token);
    return user ? JSON.parse(user) : null;
  }

  changeProfile(profile: ChangeProfileAdminVM): Observable<any> {
    return this.http.put(`${this.baseUrl}`, profile).pipe(
      tap(() => {
        let admin = JSON.parse(localStorage.getItem(this.Token) || '{}');
        admin.nom = profile.nom;
        admin.prenom = profile.prenom;
        admin.email = profile.email;
        admin.tel = profile.tel;
        localStorage.setItem(this.Token, JSON.stringify(admin));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(id:number,admin: ChangePasswordAdminVM): Observable<any> {
    return this.http.put(`${this.baseUrl}/password/${id}`, admin ).pipe(
      tap(() => {
        console.log("password bien modifier");
      }),
      catchError(this.handleError)
    );
  }

  public errorMessage: HttpErrorResponse = {} as HttpErrorResponse;

  private handleError(error: HttpErrorResponse) {
    console.log("errrrrrrrrrrrrrr");
    this.errorMessage = error;
    console.log("errrrrrrrrrrrrrr");
    return throwError(() => new Error(error.error));
   
  }

}