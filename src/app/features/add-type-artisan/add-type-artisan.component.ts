import { Component, ViewChild } from '@angular/core';
import { ArtisanTypesForm } from '../../core/FormService/ArtisanTypesForm.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ArtisanClientService } from '../../core/models/artisan-client-service.model';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { AddArtisanTypeVM } from '../../core/ViewModels/AddArtisanTypeVM';
import { Router, RouterLink } from '@angular/router';
import { MessageState } from '../../core/ViewModels/MessageState';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { LoadingService } from '../../core/services/loading.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-type-artisan',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,NgFor,NgClass,AlertMessageComponent,RouterLink],
  templateUrl: './add-type-artisan.component.html',
  styleUrl: './add-type-artisan.component.css'
})
export class AddTypeArtisanComponent {
  addtypeForm!: FormGroup;
  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;

  constructor
  (
    private typeForm : ArtisanTypesForm,
    private artisanTypesSrvice:ArtisanTypesService,
    private loadingService: LoadingService,
    private titleService: Title
  ){}

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | ADD-TYPE-ARTISAN');
    this.addtypeForm = this.typeForm.createAddTypeArtisanForm();
  }

  
  onSubmit() {
    
    if (this.addtypeForm.valid) {
      this.loadingService.show();
      const typeData: AddArtisanTypeVM = this.addtypeForm.value;

      this.artisanTypesSrvice.addArtisanType(typeData).subscribe(
        response => {
          this.loadingService.hide();
          this.message.changeMessage('Artisan type added successfully.',true);
        },
        error => {
          this.loadingService.hide();
          this.message.changeMessage(this.artisanTypesSrvice.errorMessage,false);
        }
      );
    }
  }


}
