export interface ParkingTopVM {
    id: number;
    latitude: number;
    longitude: number;
    nomParcking: string;
    adresse: string;
    surface: number;
    timeStartWork: string;
    timeEndWork: string;
    creationDate: Date;
    isWorking: boolean;
    jours: any[]; 
    lots: any[];
    artisanClientServices: any[];
  }
  