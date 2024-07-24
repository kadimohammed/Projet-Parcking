import { Artisan } from "./Artisan.model";
import { Client } from "./client.model";
import { Parking } from "./parcking.model";
import { ServiceEtat } from "./service-etat.enum";

export interface ArtisanClientService {
  id: number;
  dateService: Date;
  parking: Parking;
  parkingId: number;
  client: Client;
  clientId: number;
  artisan: Artisan;
  artisanId: number;
  etat: ServiceEtat;
}