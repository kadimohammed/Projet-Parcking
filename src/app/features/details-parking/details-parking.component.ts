import { Component, OnInit } from '@angular/core';
import { ParkingDetails } from '../../core/ViewModels/ParkingDetails.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParkingService } from '../../core/services/parking.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { ServiceEtat } from '../../core/models/service-etat.enum';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-parking-details',
  standalone: true,
  imports: [RouterLink,CommonModule,TimeFormatPipe],
  templateUrl: './details-parking.component.html',
  styleUrl: './details-parking.component.css'
})
export class ParkingDetailsComponent  implements OnInit{

  parking : ParkingDetails = {} as ParkingDetails;
  error: string | undefined;
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  constructor(
    private route : ActivatedRoute,
    private parkingService: ParkingService,
    private loadingService: LoadingService){

  }

  ngOnInit(): void {
    this.loadingService.show();
    const id = this.route.snapshot.params['id'];
    this.getParking(id);
  }



  getParking(id: number): void {
    this.parkingService.getParking(id).subscribe(
      (data: ParkingDetails) => {
        this.loadingService.hide();
        this.parking = data;
        console.log( this.parking);
      },
      (error: any) => {
        this.loadingService.hide();
        this.error = 'Erreur lors de la récupération des détails du parking';
      }
    );
  }

  
  totalCount: number = 0;
  stateCounts: { [key: string]: number } = {};
  ServiceEtat = ServiceEtat;

  calculateServiceStates(): void {
    if (this.parking.artisanClientServices) {
      this.totalCount = this.parking.artisanClientServices.length;
      this.stateCounts = this.parking.artisanClientServices.reduce((counts, service) => {
        const state = service.etat as ServiceEtat;
        counts[state] = (counts[state] || 0) + 1;
        return counts;
      }, {} as { [key in ServiceEtat]?: number });
    }
  }

  getPercentage(state: ServiceEtat): number {
    return this.stateCounts[state] ? (this.stateCounts[state] / this.totalCount) * 100 : 0;
  }

  
}
