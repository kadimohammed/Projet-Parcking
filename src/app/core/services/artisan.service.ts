import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Artisan } from '../models/Artisan.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtisanService {

  private apiUrl = 'https://localhost:7009/api/Artisans'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getArtisans(): Observable<Artisan[]> {
    console.log("getParkings() method called");
    return this.http.get<Artisan[]>(this.apiUrl).pipe(
      tap(data => console.log("Data received from API:", data))
    );
  }
}