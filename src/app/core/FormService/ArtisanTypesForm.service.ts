import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ArtisanTypesForm {
  constructor(private fb: FormBuilder) { }

  createAddTypeArtisanForm(): FormGroup {
    return this.fb.group({
      libelle: ['',[ Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  createUpdateTypeArtisanForm(): FormGroup {
    return this.fb.group({
      libelle: ['',[ Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }
  
}
