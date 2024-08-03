import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Parking } from '../../core/models/parcking.model';
import { NgFor, NgIf } from '@angular/common';
import { ParkingService } from '../../core/services/parking.service';
import { Router } from '@angular/router';
import { AddParkingVM } from '../../core/ViewModels/AddParkingVM';
import { ParkingFormService } from '../../core/FormService/ParkingForm.service';
import { ImageUploadService } from '../../core/Utility/ImageUpload.service';

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
    console.log(this.addParkingForm.value);
    if (this.addParkingForm.valid) {
      console.log(this.addParkingForm?.value);
      const parkingData: AddParkingVM = this.addParkingForm.value;

      parkingData.timeStartWork = this.formatTime(parkingData.timeStartWork);
      parkingData.timeEndWork = this.formatTime(parkingData.timeEndWork);

      this.parkingservice.addParking(parkingData).subscribe(
        response => {
          console.log('Parking added successfully:', response);
          this.router.navigate(['/parkings']);
        },
        error => {
          console.error('Error adding parking:', error);
        }
      );
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

  getDayName(index: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (index >= 0 && index < days.length) {
      return days[index];
    } else {
      return 'Invalid day index';
    }
  }
  
}
