import { Component, ViewChild } from '@angular/core';
import { ArtisanTypesForm } from '../../core/FormService/ArtisanTypesForm.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ArtisanClientService } from '../../core/models/artisan-client-service.model';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { AddArtisanTypeVM } from '../../core/ViewModels/AddArtisanTypeVM';
import { Router } from '@angular/router';
import { MessageState } from '../../core/ViewModels/MessageState';
import { AlertMessageComponent } from '../alert-message/alert-message.component';

@Component({
  selector: 'app-add-type-artisan',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,NgFor,NgClass,AlertMessageComponent],
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
  ){}

  ngOnInit(): void {
    this.addtypeForm = this.typeForm.createAddTypeArtisanForm();
  }

  
  onSubmit() {
    if (this.addtypeForm.valid) {

      const typeData: AddArtisanTypeVM = this.addtypeForm.value;

      this.artisanTypesSrvice.addArtisanType(typeData).subscribe(
        response => {
          this.message.changeMessage('type ajouter avec sucess',true);
        },
        error => {
          this.message.changeMessage(this.artisanTypesSrvice.errorMessage,false);
        }
      );
    }
  }


}
