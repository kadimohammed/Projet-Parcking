// services/parking-form.service.ts
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
        latitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
        longitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
        nomParcking: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        surface: ['', [Validators.required, Validators.min(50)]],
        timeStartWork: ['', Validators.required],
        timeEndWork: ['', Validators.required],
        creationDate: ['', Validators.required],
        isWorking: [false],
        // jours: this.fb.array(this.createDaysArray()),
        // photoParkings: [null, Validators.required] 
    });
  }

  createDaysArray(): FormControl[] {
    return Object.keys(Jours).map(day => this.fb.control(false));
  }

  
}
