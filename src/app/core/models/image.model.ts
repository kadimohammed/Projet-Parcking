import { ImageArtisan } from "./image-artisan.model";

export interface Image {
    id: number;
    path: string;
    artisanImages?: ImageArtisan[];
  }