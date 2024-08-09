import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsVM } from '../ViewModels/StatisticsVM';
import { ArtisanClientService } from '../models/artisan-client-service.model';
import { Lot } from '../models/lot.model';
import { ClientParking } from '../models/client-parking.model';

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

  
}

