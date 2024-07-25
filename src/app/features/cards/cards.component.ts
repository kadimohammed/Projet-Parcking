import { Component, OnInit } from '@angular/core';
import { ArtisanService } from '../../core/services/artisan.service';
import { ArtisansTopVM } from '../../core/ViewModels/ArtisansTopVM';
import { ParkingService } from '../../core/services/parking.service';
import { ParkingTopVM } from '../../core/ViewModels/ParkingTopVM';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule,TimeFormatPipe],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {

  artisansTop: ArtisansTopVM[] = [];
  parkingsTop: ParkingTopVM[] = [];

  constructor(private artisanService : ArtisanService,private parkingService:ParkingService){

  }


  ngOnInit(): void {
    this.getTopArtisans();
    this.getTopParkings();
  }



  getTopArtisans(){
    this.artisanService.getTopArtisans().subscribe(
      data => {
        this.artisansTop = data;
      },
      error => {
        console.error("Error occurred while fetching data:", error);
      }
    );
  }


  getTopParkings(){
    this.parkingService.getTopParkings().subscribe(
      data => {
        console.log("hiho"+data);
        this.parkingsTop = data;
      },
      error => {
        console.error("Error occurred while fetching data:", error);
      }
    );
  }



  cardClasses: string[] = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info'
  ];

  getCardClass(index: number): string {
    return this.cardClasses[index % this.cardClasses.length];
  }



}
