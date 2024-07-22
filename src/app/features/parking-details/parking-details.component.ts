import { Component, OnInit } from '@angular/core';
import { ParkingDetails } from '../../core/models/ParkingDetails.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParkingService } from '../../core/services/ParkingService';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-parking-details',
  standalone: true,
  imports: [RouterLink,CommonModule,TimeFormatPipe],
  templateUrl: './parking-details.component.html',
  styleUrl: './parking-details.component.css'
})
export class ParkingDetailsComponent  implements OnInit{

  parking : ParkingDetails = {} as ParkingDetails;
  error: string | undefined;
  constructor(private route : ActivatedRoute,private parkingService: ParkingService){

  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('id  '+id);
    this.getParking(id);
  }



  getParking(id: number): void {
    this.parkingService.getParking(id).subscribe(
      (data: ParkingDetails) => {
        this.parking = data;
      },
      (error: any) => {
        this.error = 'Erreur lors de la récupération des détails du parking';
      }
    );
  }

  
}
