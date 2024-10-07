import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Jours } from '../models/jours.enum';

@Injectable({
  providedIn: 'root'
})
export class ParkingFormService {
  constructor(private fb: FormBuilder) { }

  createAddParkingForm(): FormGroup {
    return this.fb.group({
      Latitude: ['', [Validators.required]],
      Longitude: ['', [Validators.required]],
      NomParcking: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      Adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      Surface: ['', [Validators.required, Validators.min(50)]],
      TimeStartWork: ['', Validators.required],
      TimeEndWork: ['', Validators.required],
      CreationDate: ['', Validators.required],
      IsWorking: [false],
      Jours: this.fb.array(this.createDaysArray()),
      photoParkings: this.fb.array([]) // Initialize as an empty FormArray
    });
  }

  createDaysArray(): FormControl[] {
    return Object.keys(Jours).map(day => this.fb.control(false));
  }

  createFileControl(file: File): FormControl {
    return this.fb.control(file, Validators.required);
  }
}
