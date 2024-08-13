import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParkingService } from '../../core/services/parking.service';
import { Router } from '@angular/router';
import { ParkingFormService } from '../../core/FormService/ParkingForm.service';
import { ImageUploadService } from '../../core/Utility/ImageUpload.service';
import { NgFor, NgIf } from '@angular/common';
import { AddParkingVM } from '../../core/ViewModels/AddParkingVM';

@Component({
  selector: 'app-add-parking',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './add-parking.component.html',
  styleUrls: ['./add-parking.component.css']
})
export class AddParkingComponent implements OnInit {
  addParkingForm!: FormGroup;
  uploadedImages: string[] = [];
  uploadedFileNames: string[] = [];
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private parkingService: ParkingService,
    private router: Router,
    private parkingFormService: ParkingFormService,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.addParkingForm = this.parkingFormService.createAddParkingForm();
  }

  onSubmit() {
    if (this.addParkingForm.valid) {
      const parkingData = this.addParkingForm.value as Record<string, any>;
  
      // Ensure Jours is an array of boolean values
      const joursArray = this.addParkingForm.get('Jours') as FormArray;
      parkingData['Jours'] = joursArray.controls.map(control => control.value); // Get boolean values
  
      const formData = new FormData();
  
      for (const key in parkingData) {
        if (parkingData.hasOwnProperty(key)) {
          if (key === 'photoParkings') {
            const photos = parkingData[key];
            if (photos && photos.length) {
              for (let i = 0; i < photos.length; i++) {
                formData.append('photoParkings', photos[i]);
              }
            }
          } else if (key === 'Jours') {
            // Append each boolean value in Jours as a separate entry
            parkingData['Jours'].forEach((day: boolean, index: number) => {
              formData.append(`Jours[${index}]`, String(day)); // Append each day as a string
            });
          } else {
            formData.append(key, parkingData[key]);
          }
        }
      }
  
      // Log FormData contents for debugging
      formData.forEach((value, key) => {
        console.log(key, value);
      });
  
      this.parkingService.addParking(formData).subscribe(
        response => {
          console.log('Parking added successfully:', response);
          // this.router.navigate(['/parkings']);
        },
        error => {
          console.error('Error adding parking:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  
  
  

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageUploadService.handleFileChange(event, this.addParkingForm);
      if (!this.addParkingForm.get('photoParkings')?.errors) {
        this.uploadedImages = Array.from(input.files).map(file => URL.createObjectURL(file));
        this.uploadedFileNames = Array.from(input.files).map(file => file.name);
      } else {
        console.error(this.addParkingForm.get('photoParkings')?.errors);
      }
    }
  }
  
  

  private formatTime(time: string): string {
    return time?.length === 5 ? time + ':00' : time;
  }

  onDayChange(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const joursArray = this.addParkingForm.get('Jours') as FormArray;
    joursArray.at(index).setValue(input.checked);
  }
}
