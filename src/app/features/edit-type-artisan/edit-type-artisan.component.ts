import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { ArtisanTypesForm } from '../../core/FormService/ArtisanTypesForm.service';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { UpdateArtisanTypeVM } from '../../core/ViewModels/UpdateArtisanTypeVM';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-update-type-artisan',
  standalone: true,
  imports: [AlertMessageComponent,FormsModule,ReactiveFormsModule,NgIf,RouterLink],
  templateUrl: './edit-type-artisan.component.html',
  styleUrl: './edit-type-artisan.component.css'
})
export class UpdateTypeArtisanComponent {
  updatetypeForm!: FormGroup;
  oldLibelle:String = "";
  typeId: number  = 0;
  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;

  constructor
  (
    private typeForm : ArtisanTypesForm,
    private artisanTypesSrvice:ArtisanTypesService,
    private router : Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ){}

  ngOnInit(): void {   
    this.typeId = +this.route.snapshot.paramMap.get('id')!;
    this.getArtisanTypeByID(this.typeId);
    this.updatetypeForm = this.typeForm.createUpdateTypeArtisanForm();
  }


  getArtisanTypeByID(id: number) {
    this.artisanTypesSrvice.getArtisanTypeById(id).subscribe(
      response => {
        this.oldLibelle = response.libelle;
      },
      error => {
        this.message.changeMessage(this.artisanTypesSrvice.errorMessage, false);
      }
    );
  }

  
  onSubmit() {
    
    if (this.updatetypeForm.valid) {
      this.loadingService.show();
      const typeData: UpdateArtisanTypeVM = this.updatetypeForm.value;
      console.log(this.typeId);
      this.artisanTypesSrvice.updateArtisanType(this.typeId,typeData).subscribe(
        response => {
          this.loadingService.hide();
          this.message.changeMessage('Artisan type Updated successfully.',true);
          //this.router.navigate(['/typesArtisan']);
        },
        error => {
          this.loadingService.hide();
          this.message.changeMessage(this.artisanTypesSrvice.errorMessage,false);
        }
      );
    }
  }

}
