import { ArtisanClientService } from "./artisan-client-service.model";
import { ClientParking } from "./client-parking.model";
import { User } from "./user.model";

export interface Client extends User {
    adresse: string;
    active: boolean;
    artisanClientServices?: ArtisanClientService[];
    clientParkings?: ClientParking[];
  }