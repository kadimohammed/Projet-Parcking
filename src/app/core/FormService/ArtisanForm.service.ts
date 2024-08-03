import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ArtisanFormService {
  constructor(private fb: FormBuilder) { }

  createAddArtisanForm(): FormGroup {
    return this.fb.group({
        Nom: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        Prenom: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        Email: new FormControl('', [Validators.required, Validators.email]),
        Tel: new FormControl('', [Validators.required]),
        Photo: [null],
        Profession: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
        AnneeExperience: new FormControl(0, [Validators.required, Validators.min(0)]),
        Type: new FormControl(null, [Validators.required]),
        Active: new FormControl(true) 
    });
}

createUpdateArtisanForm(): FormGroup {
  return this.fb.group({
      Nom: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      Prenom: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Tel: new FormControl('', [Validators.required]),
      Photo: [null],
      Profession: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      AnneeExperience: new FormControl(0, [Validators.required, Validators.min(0)]),
      Type: new FormControl(null, [Validators.required]),
      Active: new FormControl(true) 
  });
}

}
