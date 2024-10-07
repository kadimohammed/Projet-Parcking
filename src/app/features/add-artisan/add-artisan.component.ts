import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtisanFormService } from '../../core/FormService/ArtisanForm.service';
import { NgFor, NgIf } from '@angular/common';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TypeArtisan } from '../../core/models/TypeArtisan.model';
import { ArtisanService } from '../../core/services/artisan.service';
import { LoadingService } from '../../core/services/loading.service';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-artisan',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor,AlertMessageComponent,RouterLink],
  templateUrl: './add-artisan.component.html',
  styleUrls: ['./add-artisan.component.css'] // Correction du champ 'styleUrls'
})
export class AddArtisanComponent implements OnInit {
  addArtisanForm!: FormGroup;
  ArtisanTypes: TypeArtisan[] = [];
  formData : FormData = new FormData();
  file : any ;

  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;


  constructor(
    private artisanForm: ArtisanFormService,
    private artisanTypesService: ArtisanTypesService,
    private artisanService: ArtisanService,
    private loadingService : LoadingService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | ADD-ARTISAN');
    this.loadArtisanTypes();
    this.addArtisanForm = this.artisanForm.createAddArtisanForm();
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
    this.file = event.target.files[0];
  
    const allowedExtensions = ['.jpg', '.png', '.jpeg'];
    const maxSize = 1 * 1024 * 1024;
    const fileExtension = this.file?.name.split('.').pop()?.toLowerCase();
    this.addArtisanForm.get('Photo')?.setErrors(null);
  
    if (this.file) {
      if (!allowedExtensions.includes('.' + fileExtension)) {
        this.addArtisanForm.get('Photo')?.setErrors({ invalidFiles: ['Invalid file extension. Allowed extensions are: ' + allowedExtensions.join(', ')] });
        return;
      }
  
      if (this.file.size > maxSize) {
        this.addArtisanForm.get('Photo')?.setErrors({ invalidFiles: ['Image size must be less than 1 MB.'] });
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
    if(this.addArtisanForm.valid){
        this.loadingService.show();
        Object.keys(this.addArtisanForm.controls).forEach(key => {
          if(key != 'Photo'){
            this.formData.set(key, this.addArtisanForm.get(key)?.value);
          }
        });
  
        this.artisanService.addArtisan(this.formData).subscribe(
          response => {
            this.loadingService.hide();
            this.message.changeMessage('Add Artisan successfully',true);
          },
          error => {
            this.loadingService.hide();
            if(this.artisanService.errorMessage === '1'){
              this.addArtisanForm.controls['Email'].setErrors({ exist: true });
            }
            else if(this.artisanService.errorMessage == '2'){
              this.addArtisanForm.controls['Type'].setErrors({ typeIncorrect: true });
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
