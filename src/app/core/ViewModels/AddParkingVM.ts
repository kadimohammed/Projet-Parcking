import { ArtisanClientService } from "../models/artisan-client-service.model";
import { Lot } from "../models/lot.model";
import { ParkingJours } from "../models/parking-jours.model";
import { PhotoParking } from "../models/PhotoParking.model";

export interface AddParkingVM {
  Latitude: number;
  Longitude: number;
  NomParcking: string;
  Adresse: string;
  Surface: number;
  TimeStartWork: string; 
  TimeEndWork: string;
  CreationDate: string; 
  IsWorking: boolean;
  Jours: boolean[];
  photoParkings: File[];
}
