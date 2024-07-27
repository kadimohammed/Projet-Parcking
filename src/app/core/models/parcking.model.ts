import { ArtisanClientService } from "./artisan-client-service.model";
import { Lot } from "./lot.model";
import { ParkingJours } from "./parking-jours.model";
import { PhotoParking } from "./PhotoParking.model";

export interface Parking {
  id: number;
  latitude: number;
  longitude: number;
  nomParcking: string;
  adresse: string;
  surface: number;
  timeStartWork: string;
  timeEndWork: string;
  creationDate: Date;
  isWorking: boolean;
  jours?: ParkingJours[]; 
  lots?: Lot[];
  artisanClientServices?: ArtisanClientService[];
  photoParkings?: PhotoParking[];
}
