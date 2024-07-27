import { PhotoParking } from "./PhotoParking.model";

export interface Photo {
    id: number;
    path: string;
    photoParkings?: PhotoParking[];
}
  