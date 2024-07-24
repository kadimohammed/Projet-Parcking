import { ArisanJours } from "../models/ArisanJours.model";
import { ArtisanClientService } from "../models/artisan-client-service.model";
import { ImageArtisan } from "../models/image-artisan.model";
import { TypeArtisan } from "../models/TypeArtisan.model";

export interface ArtisansListVM {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    tel: string;
    photo?: string;
    coverPhoto?: string;
    
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
    