import { Component, ViewChild } from '@angular/core';
import { ArtisanFormService } from '../../core/FormService/ArtisanForm.service';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { ArtisanService } from '../../core/services/artisan.service';
import { LoadingService } from '../../core/services/loading.service';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { TypeArtisan } from '../../core/models/TypeArtisan.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Artisan } from '../../core/models/Artisan.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-update-artisan',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor,AlertMessageComponent,RouterLink],
  templateUrl: './update-artisan.component.html',
  styleUrl: './update-artisan.component.css'
})
export class EditArtisanComponent {
  updateArtisanForm!: FormGroup;
  ArtisanTypes: TypeArtisan[] = [];
  Artisan: Artisan = {} as Artisan;
  formData : FormData = new FormData();
  file : any ;
  typefile : boolean = true ;
  artisanId : number = 0;

  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;


  constructor(
    private artisanForm: ArtisanFormService,
    private artisanTypesService: ArtisanTypesService,
    private artisanService: ArtisanService,
    private loadingService : LoadingService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | UPDATE-ARTISAN');
    this.artisanId = +this.route.snapshot.paramMap.get('id')!;
    this.getArtisan(this.artisanId);
    this.loadArtisanTypes();
    this.updateArtisanForm = this.artisanForm.createUpdateArtisanForm();
  }

  getArtisan(id:number): void {
    this.artisanService.getArtisansById(id).subscribe({
      next: (data) => {
        this.Artisan  = data;
        this.updateArtisanForm.patchValue({
          Nom: this.Artisan.nom,
          Prenom: this.Artisan.prenom,
          Email: this.Artisan.email,
          Tel: this.Artisan.tel,
          Profession: this.Artisan.profession,
          AnneeExperience: this.Artisan.anneeExperience,
          Type: this.Artisan.typeArtisanId,
          Active: this.Artisan.active,
        });
        this.file = this.Artisan.photo;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading artisan types', error);
      }
    });
  }

  loadArtisanTypes(): void {
    this.artisanTypesService.getArtisanTypes().subscribe({
      next: (data) => {
        this.ArtisanTypes = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading artisan types', error);
      }
    });
  }


  onFileChange(event: any) {
    this.typefile = false;
    this.file = event.target.files[0];
  
    const allowedExtensions = ['.jpg', '.png', '.jpeg'];
    const maxSize = 5 * 1024 * 1024;
    const fileExtension = this.file?.name.split('.').pop()?.toLowerCase();
    this.updateArtisanForm.get('Photo')?.setErrors(null);
  
    if (this.file) {
      if (!allowedExtensions.includes('.' + fileExtension)) {
        this.updateArtisanForm.get('Photo')?.setErrors({ invalidFiles: ['Invalid file extension. Allowed extensions are: ' + allowedExtensions.join(', ')] });
        return;
      }
  
      if (this.file.size > maxSize) {
        this.updateArtisanForm.get('Photo')?.setErrors({ invalidFiles: ['Image size must be less than 5 MB.'] });
        return;
      }
      this.formData.set('Photo', this.file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.file = e.target?.result;
      };
      reader.readAsDataURL(this.file);
    }
  }
  

  onSubmit() {
    if(this.updateArtisanForm.valid){
        this.loadingService.show();
        Object.keys(this.updateArtisanForm.controls).forEach(key => {
          if(key != 'Photo'){
            this.formData.set(key, this.updateArtisanForm.get(key)?.value);
          }
        });
  
        this.artisanService.UpdateArtisan(this.artisanId,this.formData).subscribe(
          response => {
            this.loadingService.hide();
            this.message.changeMessage('Artisan Updated successfully',true);
          },
          error => {
            this.loadingService.hide();
            if(this.artisanService.errorMessage === '1'){
              this.updateArtisanForm.controls['Email'].setErrors({ exist: true });
            }
            else if(this.artisanService.errorMessage == '2'){
              this.updateArtisanForm.controls['Type'].setErrors({ typeIncorrect: true });
            }
            else{
              this.message.changeMessage(error,false);
            }
          }
        );
      }
      else{
        this.message.changeMessage("Formailaire Inorrect !!",false);
      }
    }
}
