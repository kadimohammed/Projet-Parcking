import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Parking } from '../models/parcking.model'; // Assurez-vous d'avoir un modèle Parking
import { ParkingDetails } from '../ViewModels/ParkingDetails.model';
import { ListPakingVM } from '../ViewModels/ListPakingVM';
import { ParkingTopVM } from '../ViewModels/ParkingTopVM';
import { AddParkingVM } from '../ViewModels/AddParkingVM';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private apiUrl = 'https://localhost:7009/api/Parkings'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getParkings(page: number, size: number, text: string, active?: boolean): Observable<ListPakingVM> {
    let params = new HttpParams()
        .set('text', text)
        .set('pageNumber', page)
        .set('pageSize', size);

    if (active !== undefined) {
        params = params.set('active', active.toString());
    }

    return this.http.get<ListPakingVM>(this.apiUrl, { params });
  }

  getAllParkings(): Observable<Parking[]> {
    return this.http.get<Parking[]>(this.apiUrl);
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

  addParking(parking: AddParkingVM): Observable<AddParkingVM> {
    return this.http.post<AddParkingVM>(`${this.apiUrl}`, parking);
  }

   // Méthode pour mettre à jour un parking
  updateParking(parking: Parking): Observable<Parking> {
    return this.http.put<Parking>(`${this.apiUrl}/${parking.id}`, parking);
  }

  getTopParkings(): Observable<ParkingTopVM[]> {
    return this.http.get<ParkingTopVM[]>(this.apiUrl+"/top").pipe(
      tap(data => console.log("Data received from API:", data))
    );
  }
}
