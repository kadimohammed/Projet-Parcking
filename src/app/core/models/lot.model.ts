import { ClientParking } from "./client-parking.model";
import { Parking } from "./parcking.model";
import { Point } from "./point.model";

export interface Lot {
    id: number;
    disponibilty: boolean; 
    numOfLot: number;
    width: number;
    height: number;
    centreX: number;
    centreY: number;
    angleDivation: number;
    parking: Parking;
    points?: Point[];
    clientParkings?: ClientParking[];
  }