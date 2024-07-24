import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ParkingService } from '../../core/services/parking.service';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { ListPakingVM } from '../../core/ViewModels/ListPakingVM';
import { Parking } from '../../core/models/parcking.model';

@Component({
  selector: 'app-list-parcking',
  standalone: true,
  imports: [NgFor,CommonModule,MatPaginator,RouterLink,TimeFormatPipe],
  templateUrl: './list-parcking.component.html',
  styleUrl: './list-parcking.component.css'
})
export class ListParckingComponent implements OnInit {

  parkings: Parking[] = [];
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(private parkingService: ParkingService) { }

  ngOnInit(): void {
    this.loadParkings();
  }

  loadParkings(): void {
    this.parkingService.getParkings(this.currentPage, this.pageSize).subscribe(
      data => {
        if (data) {
          this.parkings = data.items;
          this.totalCount = data.totalCount;
          console.log("count="+this.totalCount);
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          console.error("Invalid data format:", data);
        }
      },
      error => {
        console.error("Error occurred while fetching parkings:", error);
      }
    );
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.currentPage = pageNumber;
    this.loadParkings();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
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


  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }



  searchParkings(text:string){
    if (text.trim() === '') {
      this.loadParkings();
    } 
    else
    {
      this.parkingService.searchParkings(text).subscribe(
        data => {
          if (data) {
            this.parkings = data.items;
            this.totalCount = data.totalCount;
            console.log("count="+this.totalCount);
            this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          } else {
            console.error("Invalid data format:", data);
          }
        },
        error => {
          console.error("Error occurred while fetching parkings:", error);
        }
      );
    }
    
  }

}
