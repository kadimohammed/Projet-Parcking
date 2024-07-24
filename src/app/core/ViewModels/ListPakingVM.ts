import { Parking } from "../models/parcking.model";

export interface ListPakingVM {
    totalCount: number;
    items: Parking[];
  }