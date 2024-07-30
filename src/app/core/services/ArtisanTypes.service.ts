import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TypeArtisan } from '../models/TypeArtisan.model';
import { AddArtisanTypeVM } from '../ViewModels/AddArtisanTypeVM';
import { UpdateArtisanTypeVM } from '../ViewModels/UpdateArtisanTypeVM';

@Injectable({
  providedIn: 'root'
})
export class ArtisanTypesService {
  private apiUrl = 'https://localhost:7009/api/TypeArtisans';
  public errorMessage: string = '';

  constructor(private http: HttpClient) { }

  getArtisanTypes(): Observable<TypeArtisan[]> {
    return this.http.get<TypeArtisan[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 404:
            this.errorMessage = `Ressource non trouvée lors du chargement des Artisan Types.`;
            break;
          case 500:
            this.errorMessage = `Erreur 500: Erreur interne du serveur lors du chargement des Artisan Types.`;
            break;
          default:
            this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  deleteArtisanType(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.errorMessage = `Connexion impossible au serveur.`;
            break;
          case 400:
            this.errorMessage = `Artisan Type n'exist pas !!`;
            break;
          case 500:
            this.errorMessage = `Erreur interne du serveur lors la suppression de Artisans Type.`;
            break;
          default:
            this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }
  
  addArtisanType(type: AddArtisanTypeVM): Observable<AddArtisanTypeVM> {
    return this.http.post<AddArtisanTypeVM>(`${this.apiUrl}`, type).pipe(
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 0:
              this.errorMessage = `Connexion impossible au serveur.`;
              break;
            case 400:
              this.errorMessage = `Artisan Type n'exist pas !!`;
              break;
            case 500:
              this.errorMessage = `Erreur interne du serveur lors la suppression de Artisans Type.`;
              break;
            default:
              this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
          }
          return throwError(() => new Error(this.errorMessage));
        })
      );
  }


  updateArtisanType(id:number,type: UpdateArtisanTypeVM): Observable<UpdateArtisanTypeVM> {
    return this.http.put<UpdateArtisanTypeVM>(`${this.apiUrl}/${id}`, type).pipe(
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 0:
              this.errorMessage = `Connexion impossible au serveur.`;
              break;
            case 400:
              this.errorMessage = `Artisan Type n'exist pas !!`;
              break;
            case 500:
              this.errorMessage = `Erreur interne du serveur lors la suppression de Artisans Type.`;
              break;
            default:
              this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
          }
          return throwError(() => new Error(this.errorMessage));
        })
      );
  }


  getArtisanTypeById(id: number): Observable<TypeArtisan> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<TypeArtisan>(url).pipe(
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 0:
              this.errorMessage = `Connexion impossible au serveur.`;
              break;
            case 400:
              this.errorMessage = `Artisan Type n'exist pas !!`;
              break;
            case 500:
              this.errorMessage = `Erreur interne du serveur lors la suppression de Artisans Type.`;
              break;
            default:
              this.errorMessage = `Erreur ${error.status}: Une erreur est survenue lors du ${error.message}.`;
          }
          return throwError(() => new Error(this.errorMessage));
        })
      );
  }
  

  

//   getTopArtisans(): Observable<ArtisansTopVM[]> {
//     return this.http.get<ArtisansTopVM[]>(this.apiUrl+"/top").pipe(
//       tap(data => console.log("Data received from API:", data))
//     );
//   }

}