import { Artisan } from "./Artisan.model";

export interface TypeArtisan {
    id: number;
    libelle: string;
    artisans?: Artisan[];
  }
  