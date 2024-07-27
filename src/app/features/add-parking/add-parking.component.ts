import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Parking } from '../../core/models/parcking.model';
import { NgFor, NgIf } from '@angular/common';
import { ParkingService } from '../../core/services/parking.service';
import { Router } from '@angular/router';
import { AddParkingVM } from '../../core/ViewModels/AddParkingVM';
import { ParkingFormService } from '../../core/FormService/ParkingForm.service';
import { ImageUploadService } from '../../core/Utility/ImageUpload.services';

@Component({
  selector: 'app-add-parking',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './add-parking.component.html',
  styleUrl: './add-parking.component.css'
})
export class AddParkingComponent implements OnInit {
  addParkingForm!: FormGroup;

  constructor(private parkingservice : ParkingService,private router : Router,private parkingFormService: ParkingFormService,private imageUploadService: ImageUploadService){
  }
  
  ngOnInit(): void {
    this.addParkingForm = this.parkingFormService.createAddParkingForm();
  }

  onSubmit() {
    if (this.addParkingForm.valid) {
      console.log(this.addParkingForm?.value);
      const parkingData: AddParkingVM = this.addParkingForm.value;

      // this.parking.timeStartWork = this.formatTime(this.parking.timeStartWork);
      // this.parking.timeEndWork = this.formatTime(this.parking.timeEndWork);

      // this.parkingModel = this.parkingMapperService.mapAddParkingVMToParking(this.parking);

      // this.parkingservice.addParking(this.parkingModel).subscribe(
      //   response => {
      //     console.log('Parking added successfully:', response);
      //     this.router.navigate(['/parkings']);
      //   },
      //   error => {
      //     console.error('Error adding parking:', error);
      //   }
      // );
    }
  }

  uploadedImages: string[] = [];
  uploadedFileNames: string[] = [];
  
  onFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
          this.imageUploadService.handleFileChange(event, this.addParkingForm);
          this.uploadedImages = Array.from(input.files).map(file => URL.createObjectURL(file));
          this.uploadedFileNames = Array.from(input.files).map(file => file.name);
      }
  }


  private formatTime(time: string): string {
    if (time.length === 5) {
      return time + ':00';
    }
    return time;
  }

}
