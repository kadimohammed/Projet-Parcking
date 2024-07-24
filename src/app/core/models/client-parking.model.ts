import { Client } from "./client.model";
import { Lot } from "./lot.model";

export interface ClientParking {
    id: number;
    datePark: Date;
    client: Client;
    clientId: number;
    lot: Lot;
    lotId: number;
  }