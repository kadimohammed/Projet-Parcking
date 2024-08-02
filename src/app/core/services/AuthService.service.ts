import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Login } from '../ViewModels/Login.model';
import { ChangeProfileAdminVM } from '../ViewModels/ChangeProfileAdminVM';
import { Admin } from '../models/admin.model';
import { ChangePasswordAdminVM } from '../ViewModels/ChangePasswordAdminVM';
import { logintTkenVM } from '../ViewModels/logintokenVM';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7009/api/Admin';
  private key : string = 'admin';
  private adminUser : logintTkenVM = {} as logintTkenVM;
  public errorMessage : string = '';

  constructor(private http: HttpClient, private router: Router) { }

  loginuser(loginModel: Login): Observable<logintTkenVM> {
    return this.http.post<logintTkenVM>(`${this.baseUrl}`, loginModel).pipe(
      tap(response => {
        localStorage.setItem(this.key, JSON.stringify(response));
        this.adminUser = response;
      }),
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 404:
            this.errorMessage = `Ressource non trouvée lors du SignIn.`;
            break;
          case 500:
            this.errorMessage = `Erreur 500: Erreur interne du serveur lors lors du SignIn.`;
            break;
          case 400:
              this.errorMessage = `Email Or Password Invalid !!`;
              break;
          default:
            this.errorMessage = `Erreur: Une erreur est survenue.`;
        }
        return throwError(() => new Error(this.errorMessage));
      }
    ));
  }
  
  
  logout(): void {
    localStorage.removeItem(this.key);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.key);
  }

  setUser(admin: Admin) {
    localStorage.setItem(this.key, JSON.stringify(admin));
  }

  getUser() {
    const user = localStorage.getItem(this.key);
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return this.adminUser.token;
  }

  changeProfile(profile: ChangeProfileAdminVM): Observable<any> {
    return this.http.put(`${this.baseUrl}`, profile).pipe(
      tap(() => {
        let admin = JSON.parse(localStorage.getItem(this.key) || '{}');
        admin.nom = profile.nom;
        admin.prenom = profile.prenom;
        admin.email = profile.email;
        admin.tel = profile.tel;
        localStorage.setItem(this.key, JSON.stringify(admin));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(id:number,admin: ChangePasswordAdminVM): Observable<any> {
    return this.http.put(`${this.baseUrl}/password/${id}`, admin ).pipe(
      tap(() => {
        console.log("password bien modifier");
      }),
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 404:
            this.errorMessage = `Ressource non trouvée lors du changement du password.`;
            break;
          case 500:
            this.errorMessage = `Erreur interne du serveur lors du changement du password.`;
            break;
          case 400:
              this.errorMessage = `400`;
              break;
          default:
            this.errorMessage = `Une erreur est survenue.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error));
  }

}