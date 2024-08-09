import { ArtisanClientService } from "../models/artisan-client-service.model";
import { Artisan } from "../models/Artisan.model";
import { Client } from "../models/client.model";
import { Parking } from "../models/parcking.model";

export interface StatisticsVM {
    Artisans?: Artisan[];
    Clients?: Client[]; 
    Parkings?: Parking[];
    ArtisanClientServices?: ArtisanClientService[]; 
  }
  