import { Component, OnInit } from '@angular/core';
import { ArtisanService } from '../../core/services/artisan.service';
import { ArtisansTopVM } from '../../core/ViewModels/ArtisansTopVM';
import { ParkingService } from '../../core/services/parking.service';
import { ParkingTopVM } from '../../core/ViewModels/ParkingTopVM';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';
import { LoadingService } from '../../core/services/loading.service';
import { Title as TitleService } from '@angular/platform-browser';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule,TimeFormatPipe,RouterLink],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {

  artisansTop: ArtisansTopVM[] = [];
  parkingsTop: ParkingTopVM[] = [];
  clientTop: Client[] = [];

  constructor(
    private artisanService : ArtisanService,
    private parkingService:ParkingService,
    private clientService : ClientService,
    private loadingService: LoadingService,
    private titleService: TitleService
  ){

  }


  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | TENDENCY-NEWS');
    this.loadingService.show();
    this.getTopArtisans();
    this.getTopParkings();
    this.getTopClient();
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
        this.parkingsTop = data;
        this.loadingService.hide();
      },
      error => {
        console.error("Error occurred while fetching data:", error);
        this.loadingService.hide();
      }
    );
  }


  getTopClient(){
    this.clientService.getTopClients().subscribe(
      data => {
        this.clientTop = data;
        this.clientPairs = this.getClientPairs();
      },
      error => {
        console.error("Error occurred while fetching data:", error);
      }
    );
  }

  clientPairs: Client[][] = [];

  getClientPairs(): Client[][] {
    const pairs = [];
    for (let i = 0; i < this.clientTop.length; i += 2) {
      pairs.push(this.clientTop.slice(i, i + 2));
    }
    return pairs;
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
