import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ParkingService } from '../../core/services/parking.service';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { Parking } from '../../core/models/parcking.model';
import { LoadingService } from '../../core/services/loading.service';

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
  searchText : string = "";
  active? : boolean = undefined;

  parkingsActiveInput? : boolean = true;
  parkingsNonActiveInput? : boolean = true;

  constructor(private parkingService: ParkingService,private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.loadParkings();
  }

  loadParkings(): void {
    
    this.parkingService.getParkings(this.currentPage, this.pageSize, this.searchText,this.active).subscribe(
      data => {
        if (data) {
          this.parkings = data.items;
          this.totalCount = data.totalCount;
          console.log("count="+this.totalCount);
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        } else {
          console.error("Invalid data format:", data);
        }
        this.loadingService.hide(); 
      },
      error => {
        console.error("Error occurred while fetching parkings:", error);
        this.loadingService.hide(); 
      }
    );
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.currentPage = pageNumber;
    this.loadingService.show();
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
      this.searchText = "";
    } 
    else
    {
      this.searchText = text;
    }
    this.currentPage = 1;
    this.loadParkings();
  }

  changePageSize(size : number){
    this.pageSize = size;
    this.currentPage = 1;
    this.loadingService.show();
    this.loadParkings();
  }

  getParkingsActive(event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.parkingsActiveInput = true;
    }else{
      this.parkingsActiveInput = false;
    }
    this.getParkingsEtat();

  }

  getParkingsNonActive(event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.parkingsNonActiveInput = true;
    }else{
      this.parkingsNonActiveInput = false;
    }
    this.getParkingsEtat();
  }


  getParkingsEtat(){
    if((this.parkingsActiveInput && this.parkingsNonActiveInput) || (!this.parkingsActiveInput && !this.parkingsNonActiveInput)){
      this.active = undefined;
    }
    else if(this.parkingsActiveInput){
      this.active = true;
    }else{
      this.active = false;
    }
    this.currentPage = 1;
    this.loadingService.show();
    this.loadParkings();
  }



}
