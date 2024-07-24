import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Parking } from '../../core/models/parcking.model';
import { ParkingService } from '../../core/services/parking.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-parking',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './edit-parking.component.html',
  styleUrl: './edit-parking.component.css'
})
export class EditParkingComponent {
  @Input() parking : Parking = {} as Parking;
  parkingId: number  = 0;

  constructor(private parkingService : ParkingService,private router : Router,private route: ActivatedRoute){
  }
  
  ngOnInit() {
    // Get the parking ID from the route parameters
    this.parkingId = +this.route.snapshot.paramMap.get('id')!;
    this.loadParking();
  }

  loadParking() {
    this.parkingService.getParking(this.parkingId).subscribe(
      (data: Parking) => {
        this.parking = data;
        if (this.parking.creationDate) {
          // Convertir `creationDate` en format `yyyy-MM-dd`
          this.parking.creationDate = this.parking.creationDate;
        }
        console.log(this.parking);
      },
      error => {
        console.error('Error loading parking data:', error);
      }
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Format the times before sending them
      this.parking.timeStartWork = this.formatTime(this.parking.timeStartWork);
      this.parking.timeEndWork = this.formatTime(this.parking.timeEndWork);

      this.parkingService.updateParking(this.parking).subscribe(
        response => {
          console.log('Parking updated successfully:', response);
          this.router.navigate(['/parkings']); // Redirect after successful update
        },
        error => {
          console.error('Error updating parking:', error);
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
