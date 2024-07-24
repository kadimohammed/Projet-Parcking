import { Artisan } from "./Artisan.model";
import { Image } from "./image.model";

export interface ImageArtisan {
    id: number;
    path: string;
    image: Image;
    imageId: number;
    artisan: Artisan;
    artisanId: number;
  }