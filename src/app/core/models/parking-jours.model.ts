import { Jours } from "./jours.enum";
import { Parking } from "./parcking.model";

export interface ParkingJours {
    id: number;
    parking: Parking;
    parkingId: number;
    jour: Jours;
  }