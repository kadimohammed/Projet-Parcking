import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParkingService } from '../../core/services/parking.service';
import { Router, RouterLink } from '@angular/router';
import { ParkingFormService } from '../../core/FormService/ParkingForm.service';
import { ImageUploadService } from '../../core/Utility/ImageUpload.service';
import { NgFor, NgIf } from '@angular/common';
import { AddParkingVM } from '../../core/ViewModels/AddParkingVM';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { LoadingService } from '../../core/services/loading.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-add-parking',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor,AlertMessageComponent,RouterLink],
  templateUrl: './add-parking.component.html',
  styleUrls: ['./add-parking.component.css']
})
export class AddParkingComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: L.Map;
  marker!: L.Marker;

  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;
  addParkingForm!: FormGroup;
  uploadedImages: string[] = [];
  uploadedFileNames: string[] = [];
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private parkingService: ParkingService,
    private router: Router,
    private parkingFormService: ParkingFormService,
    private imageUploadService: ImageUploadService,
    private loadingService : LoadingService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | ADD-PARKING');
    this.initializeMap();
    this.addParkingForm = this.parkingFormService.createAddParkingForm();
  }

  initializeMap(): void {
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

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      }

      this.addParkingForm.patchValue({
        Latitude: lat,
        Longitude: lng
      });
    });
}

onSubmit() {
  if (this.addParkingForm.valid) {
    this.loadingService.show();
    const parkingData = this.addParkingForm.value as Record<string, any>;
  
    // Ensure Jours is an array of boolean values
    const joursArray = this.addParkingForm.get('Jours') as FormArray;
    parkingData['Jours'] = joursArray.controls.map(control => control.value); // Get boolean values
    
    const formData = new FormData();
    
    for (const key in parkingData) {
      if (parkingData.hasOwnProperty(key)) {
        if (key === 'photoParkings') {
          // Gestion des images
          const photos = parkingData[key];
          if (photos && photos.length) {
            for (let i = 0; i < photos.length; i++) {
              formData.append('photoParkings', photos[i]);
            }
          }
        } else if (key === 'Jours') {
          // Ajouter chaque jour de travail comme une valeur booléenne
          parkingData['Jours'].forEach((day: boolean, index: number) => {
            formData.append(`Jours[${index}]`, String(day));
          });
        } else {
          // Vérifier si le champ est Latitude ou Longitude et remplacer les points par des virgules
          if (key === 'Latitude' || key === 'Longitude') {
            const valueWithComma = parkingData[key].toString().replace('.', ',');
            formData.append(key, valueWithComma);
          } else {
            formData.append(key, parkingData[key]);
          }
        }
      }
    }

    // Log FormData contents for debugging
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.parkingService.addParking(formData).subscribe(
      response => {
        this.loadingService.hide();
        this.message.changeMessage('Parking added successfully.', true);
      },
      error => {
        this.loadingService.hide();
        this.message.changeMessage('Error adding parking.', false);
        console.log(error.error);
      }
    );
  } else {
    this.loadingService.hide();
    this.message.changeMessage('Form is invalid', false);
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
