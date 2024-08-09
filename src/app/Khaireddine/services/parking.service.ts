// src/app/services/parking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parking } from '../models/parking.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private static instance: ParkingService;
  private apiUrl = 'https://localhost:7009/api/Parkings';

  private constructor(private http: HttpClient) {}

  public static getInstance(http: HttpClient): ParkingService {
    if (!ParkingService.instance) {
      ParkingService.instance = new ParkingService(http);
    }
    return ParkingService.instance;
  }

  getParkings(active: boolean = true): Observable<Parking[]> {
    return this.http.get<Parking[]>(`${this.apiUrl}?active=${active}`);
  }
}
