import { Component, OnInit, ViewChild } from '@angular/core';
import { Parking } from '../../core/models/parcking.model';
import { CommonModule, NgFor } from '@angular/common';
import { ParkingService } from '../../core/services/ParkingService';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-list-parcking',
  standalone: true,
  imports: [NgFor,CommonModule,MatPaginator,RouterLink,TimeFormatPipe],
  templateUrl: './list-parcking.component.html',
  styleUrl: './list-parcking.component.css'
})
export class ListParckingComponent implements OnInit {

  parkings: Parking[] = [];

  constructor(private parkingService: ParkingService) { }
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  ngOnInit(): void {
    console.log("ngOnInit() method called");
    this.parkingService.getParkings().subscribe(
      data => {
        console.log("Data received in component:", data);
        this.parkings = data;
      },
      error => {
        console.error("Error occurred while fetching data:", error);
      }
    );
  }


  deleteParking(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce parking ?')) {
      this.parkingService.deleteParking(id).subscribe(
        () => {
          this.parkings = this.parkings.filter(p => p.id !== id);
          alert('Parking supprimé avec succès.');
        },
        (error: any) => {
          console.error('Erreur lors de la suppression du parking:', error);
          alert('Erreur lors de la suppression du parking.');
        }
      );
    }
  }

}
