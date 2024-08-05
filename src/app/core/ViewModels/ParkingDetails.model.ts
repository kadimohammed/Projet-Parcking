import { ArtisanClientService } from "../models/artisan-client-service.model";
import { Lot } from "../models/lot.model";
import { ParkingJours } from "../models/parking-jours.model";
import { PhotoParking } from "../models/PhotoParking.model";

export interface ParkingDetails {
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
  