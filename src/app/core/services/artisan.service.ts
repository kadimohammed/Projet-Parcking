import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Artisan } from '../models/Artisan.model';
import { ArtisansTopVM } from '../ViewModels/ArtisansTopVM';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ArtisanService {
  private apiUrl = 'https://localhost:7009/api/Artisans';
  public errorMessage: string = '';

  constructor(private http: HttpClient) { }

  getArtisans(): Observable<Artisan[]> {
    return this.http.get<Artisan[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 404:
            this.errorMessage = `Ressource non trouvée lors du chargement des Artisans.`;
            break;
          case 500:
            this.errorMessage = `Erreur 500: Erreur interne du serveur lors du chargement des Artisans.`;
            break;
          default:
            this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  getArtisansById(id:number): Observable<Artisan> {
    return this.http.get<Artisan>(this.apiUrl+'/'+id).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 404:
            this.errorMessage = `Ressource non trouvée lors du chargement des Artisans.`;
            break;
          case 500:
            this.errorMessage = `Erreur 500: Erreur interne du serveur lors du chargement des Artisans.`;
            break;
          default:
            this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  deleteArtisan(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 400:
            this.errorMessage = `Artisan n'exist pas !!`;
            break;
          case 500:
            this.errorMessage = `Erreur interne du serveur lors la suppression des Artisans.`;
            break;
          default:
            this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }
  

  addArtisan(artisan: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, artisan).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("erooor ajpout "+JSON.stringify(error));
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 400:
            if(error.error.errors){
              const validationErrors = error.error.errors;
              if (validationErrors.Email) {
                this.errorMessage = '1';
              } 
              else if((validationErrors.Type)) {
                this.errorMessage = '2';
              }
            }
            break;
          case 500:
            this.errorMessage = `Erreur interne du serveur lors L'insersion d'Artisan.`;
            break;
          default:
            this.errorMessage = `Une erreur est survenue.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  getTopArtisans(): Observable<ArtisansTopVM[]> {
    return this.http.get<ArtisansTopVM[]>(this.apiUrl+"/top").pipe(
      tap(data => console.log("Data received from API:", data))
    );
  }

}