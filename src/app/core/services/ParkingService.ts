import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Parking } from '../models/parcking.model'; // Assurez-vous d'avoir un modèle Parking
import { ParkingDetails } from '../models/ParkingDetails.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private apiUrl = 'https://localhost:7009/api/Parkings'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getParkings(): Observable<Parking[]> {
    console.log("getParkings() method called");
    return this.http.get<Parking[]>(this.apiUrl).pipe(
      tap(data => console.log("Data received from API:", data))
    );
  }

  // Méthode pour obtenir un parking par ID
  getParking(id: number): Observable<ParkingDetails> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ParkingDetails>(url);
  }

  deleteParking(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  addParking(parking: Parking): Observable<Parking> {
    return this.http.post<Parking>(`${this.apiUrl}`, parking);
  }

   // Méthode pour mettre à jour un parking
  updateParking(parking: Parking): Observable<Parking> {
    return this.http.put<Parking>(`${this.apiUrl}/${parking.id}`, parking);
  }
}
