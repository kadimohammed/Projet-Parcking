import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Parking } from '../../core/models/parcking.model';
import { ParkingService } from '../../core/services/parking.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-edit-parking',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,RouterLink],
  templateUrl: './edit-parking.component.html',
  styleUrl: './edit-parking.component.css'
})
export class EditParkingComponent {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() parking : Parking = {} as Parking;
  parkingId: number  = 0;
  map!: L.Map;
  marker!: L.Marker;

  constructor(private parkingService : ParkingService,private router : Router,private route: ActivatedRoute){
  }
  
  ngOnInit() {
    // Get the parking ID from the route parameters
    this.parkingId = +this.route.snapshot.paramMap.get('id')!;
    this.loadParking();
  }



  initializeMap(): void {
    // Initialiser la carte avec une vue centrée
    this.map = L.map(this.mapContainer.nativeElement).setView([34.9307773, -2.309294], 14);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  
    // Créer l'icône personnalisée
    const customIcon = L.icon({
      iconUrl: 'https://www.iconpacks.net/icons/2/free-parking-sign-icon-2526-thumb.png', // chemin vers votre icône personnalisée
      iconSize: [50, 50], // taille de l'icône
      iconAnchor: [19, 38], // point de l'icône qui correspondra à la position du marqueur
      popupAnchor: [0, -38] // point du popup par rapport au point d'ancrage de l'icône
    });
  
    // Créer le marqueur avec les coordonnées initiales (si disponibles)
    if (this.parking.latitude && this.parking.longitude) {
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      this.marker = L.marker([this.parking.latitude, this.parking.longitude], { icon: customIcon })
        .bindPopup(`${this.parking.nomParcking} \n ${this.parking.latitude}, ${this.parking.longitude}`)
        .addTo(this.map);
    }
  
    // Événement de clic sur la carte pour déplacer le marqueur
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
  
      if (this.marker) {
        // Déplacer le marqueur existant
        this.marker.setLatLng([lat, lng]);
      } else {
        // Créer un nouveau marqueur si aucun n'existe
        this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      }
  
      // Mettre à jour les coordonnées du parking
      this.parking.latitude = lat;
      this.parking.longitude = lng;
    });
  }
  


  loadParking() {
    this.parkingService.getParkingV2(this.parkingId).subscribe(
      (data: Parking) => {
        this.parking = data;
        if (this.parking.creationDate) {
          this.parking.creationDate = this.parking.creationDate;
        }
        console.log(this.parking);
        this.initializeMap();
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
