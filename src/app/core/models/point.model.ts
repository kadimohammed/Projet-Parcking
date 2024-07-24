import { Lot } from "./lot.model";

export interface Point {
    id: number;
    x: number;
    y: number;
    lot: Lot;
    lotId: number;
  }