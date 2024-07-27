import { Injectable } from '@angular/core';
import { Parking } from '../models/parcking.model';
import { AddParkingVM } from '../ViewModels/AddParkingVM';

@Injectable({
  providedIn: 'root'
})
export class ParkingMapperService {

  constructor() { }

  mapParkingToAddParkingVM(parking: Parking): AddParkingVM {
    return {
      latitude: parking.latitude,
      longitude: parking.longitude,
      nomParcking: parking.nomParcking,
      adresse: parking.adresse,
      surface: parking.surface,
      timeStartWork: parking.timeStartWork,
      timeEndWork: parking.timeEndWork,
      creationDate: parking.creationDate,
      isWorking: parking.isWorking,
      jours: parking.jours,
      photoParkings: parking.photoParkings
    };
  }

  mapAddParkingVMToParking(addParkingVM: AddParkingVM): Parking {
    return {
      id: 0, 
      latitude: addParkingVM.latitude,
      longitude: addParkingVM.longitude,
      nomParcking: addParkingVM.nomParcking,
      adresse: addParkingVM.adresse,
      surface: addParkingVM.surface,
      timeStartWork: addParkingVM.timeStartWork,
      timeEndWork: addParkingVM.timeEndWork,
      creationDate: addParkingVM.creationDate,
      isWorking: addParkingVM.isWorking,
      jours: addParkingVM.jours,
      lots: [],
      artisanClientServices: [],
      photoParkings: addParkingVM.photoParkings
    };
  }

}
