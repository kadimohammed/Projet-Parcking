import { Artisan } from "./Artisan.model";
import { Image } from "./image.model";

export interface ImageArtisan {
    id: number;
    image: Image;
    imageId: number;
    artisan: Artisan;
    artisanId: number;
  }