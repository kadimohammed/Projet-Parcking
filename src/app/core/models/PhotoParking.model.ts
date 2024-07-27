import { Parking } from "./parcking.model";
import { Photo } from "./Photo.model";

export interface PhotoParking {
    id: number;
    parking: Parking;
    parkingId: number;
    photo: Photo;
    photoId: number;
  }