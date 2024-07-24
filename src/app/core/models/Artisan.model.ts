import { ArisanJours } from "./ArisanJours.model";
import { ArtisanClientService } from "./artisan-client-service.model";
import { ImageArtisan } from "./image-artisan.model";
import { TypeArtisan } from "./TypeArtisan.model";
import { User } from "./user.model";

export interface Artisan extends User {
  adresse: string;
  profession: string;
  anneeExperience: number;
  rating: number;
  description: number;
  urlTrailer: string;
  type: TypeArtisan;
  typeArtisanId: number;
  active: boolean;
  artisanClientServices?: ArtisanClientService[];
  arisanJoursWorks?: ArisanJours[];
  artisanImages?: ImageArtisan[];
}