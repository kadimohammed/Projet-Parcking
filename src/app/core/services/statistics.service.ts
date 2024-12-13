import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsVM } from '../ViewModels/StatisticsVM';
import { ArtisanClientService } from '../models/artisan-client-service.model';
import { Lot } from '../models/lot.model';
import { ClientParking } from '../models/client-parking.model';
import { ArtisansTopVM } from '../ViewModels/ArtisansTopVM';
import { ClientParkingStatisticVM } from '../ViewModels/ClientParkingStatisticVM';
import { ArtisanParTypeCount } from '../ViewModels/ArtisanParTypeCountVM';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {


  private apiUrl = 'https://localhost:7009/api/Statistics'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getArtisanClientServices(): Observable<ArtisanClientService[]> {
    return this.http.get<ArtisanClientService[]>(this.apiUrl);
  }

  getLots(): Observable<Lot[]> {
    return this.http.get<Lot[]>(this.apiUrl+"/Lots");
  }


  getParkedClient(): Observable<ClientParking[]> {
    return this.http.get<ClientParking[]>(this.apiUrl+"/ParkedClient");
  }

  getParkingsByDayOfWeek(): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl+"/ParkingsByDayOfWeek");
  }


  getClientsByParking(): Observable<ClientParkingStatisticVM[]> {
    return this.http.get<ClientParkingStatisticVM[]>(this.apiUrl+"/ClientsByParking");
  }

  getRatingDistribution(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(`${this.apiUrl}/RatingDistribution`);
  }


  getSurfaceDistribution(): Observable<{ name: string; surface: number }[]> {
    return this.http.get<{ name: string; surface: number }[]>(`${this.apiUrl}/SurfaceDistribution`);
  }

  getArtisanParTypeCount(): Observable<ArtisanParTypeCount[]> {
    return this.http.get<ArtisanParTypeCount[]>(`${this.apiUrl}/ArtisanParTypeCount`);
  }
  
  
}

