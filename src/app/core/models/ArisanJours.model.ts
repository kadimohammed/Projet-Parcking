import { Artisan } from "./Artisan.model";
import { Jours } from "./jours.enum";

export interface ArisanJours {
    id: number;
    artisan: Artisan;
    artisanId: number;
    jour: Jours;
  }