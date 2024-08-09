import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'https://localhost:7009/api/MyClients'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
}
