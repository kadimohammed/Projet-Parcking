import { Component, Input } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Parking } from '../../core/models/parcking.model';
import { NgIf } from '@angular/common';
import { ParkingService } from '../../core/services/ParkingService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-parking',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './add-parking.component.html',
  styleUrl: './add-parking.component.css'
})
export class AddParkingComponent {
  @Input() parking : Parking = {} as Parking;

  constructor(private parkingservice : ParkingService,private router : Router){
  }
  

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.parking.timeStartWork = this.formatTime(this.parking.timeStartWork);
      this.parking.timeEndWork = this.formatTime(this.parking.timeEndWork);
      console.log(this.parking);
      this.parkingservice.addParking(this.parking).subscribe(
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


  private formatTime(time: string): string {
    if (time.length === 5) {
      return time + ':00';
    }
    return time;
  }

}
