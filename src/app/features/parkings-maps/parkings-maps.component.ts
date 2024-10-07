import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { ParkingService } from '../../core/services/parking.service';
import { Parking } from '../../core/models/parcking.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-parkings-maps',
  templateUrl: './parkings-maps.component.html',
  styleUrls: ['./parkings-maps.component.css']
})
export class ParkingsMapsComponent implements OnInit {
  private map: L.Map | undefined;
  parkingId: number  = 0
  private parkings: Parking[] = [];


  constructor(
    private parkingService: ParkingService,
    private router : Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  private customIcon = L.icon({
    iconUrl: 'https://www.iconpacks.net/icons/2/free-parking-sign-icon-2526-thumb.png', // chemin vers votre icône personnalisée
    iconSize: [50, 50], // taille de l'icône
    iconAnchor: [19, 38], // point de l'icône qui correspondra à la position du marqueur
    popupAnchor: [0, -38] // point du popup par rapport au point d'ancrage de l'icône
  });

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | PARKINGS-MAP');
    this.parkingId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.parkingId);
    if(this.parkingId == 0){
      this.loadParkings();
    }
    else{
      this.loadParkingById();
    }   
  }


  loadParkings(): void {
    this.parkingService.getAllParkings().subscribe(
      data => {
        if (data) {
          this.parkings = data;
        } else {
          console.error("Invalid data format:", data);
        }
        this.initMap();
      },
      error => {
        console.error("Error occurred while fetching parkings:", error); 
        this.initMap();
      }
    );
    
  }

  loadParkingById() :void{
    this.parkingService.getParkingV2(this.parkingId).subscribe(
      data => {
        if (data) {
          this.parkings.push(data);
        } else {
          console.error("Invalid data format:", data);
        }
        this.initMap();
      },
      error => {
        console.error("Error occurred while fetching parkings:", error); 
        this.initMap();
      }
    );
  }


  private initMap(): void {
    this.map = L.map('map', {
      center: [this.parkings[0].latitude, this.parkings[0].longitude], 
      zoom: 14
    });

    // Utiliser les tuiles Stamen Toner pour un mode sombre gratuit
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);

    const markers = L.markerClusterGroup();

    for(const pr of this.parkings){
      const marker = L.marker([pr.latitude, pr.longitude], { icon: this.customIcon }).bindPopup(`${pr.nomParcking} \n ${pr.latitude},${pr.longitude}`);
      markers.addLayer(marker);
    }
    this.map.addLayer(markers);
    
  }
}
