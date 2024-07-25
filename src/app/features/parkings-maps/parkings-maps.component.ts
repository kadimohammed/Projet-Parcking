import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-parkings-maps',
  standalone: true,
  imports: [],
  templateUrl: './parkings-maps.component.html',
  styleUrl: './parkings-maps.component.css'
})
export class ParkingsMapsComponent implements AfterViewInit {
  private map: L.Map | undefined;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialisation de la carte
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
      zoomControl: true
    });

    // Ajout de la couche des tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    // Création du groupe de clustering de marqueurs
    const markers = L.markerClusterGroup();

    // Ajout de quelques marqueurs pour l'exemple
    const marker1 = L.marker([51.5, -0.09]);
    const marker2 = L.marker([51.51, -0.1]);
    markers.addLayer(marker1).addLayer(marker2);
    this.map.addLayer(markers);

    // Gestion des événements de déplacement pour éviter des opérations lourdes
    this.map.on('moveend', () => {
      // Code léger ici
    });
  }
}
