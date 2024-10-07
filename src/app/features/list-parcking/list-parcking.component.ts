import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ParkingService } from '../../core/services/parking.service';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { Parking } from '../../core/models/parcking.model';
import { LoadingService } from '../../core/services/loading.service';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-list-parcking',
  standalone: true,
  imports: [NgFor,CommonModule,MatPaginator,RouterLink,TimeFormatPipe,ConfirmationAlertComponent],
  templateUrl: './list-parcking.component.html',
  styleUrl: './list-parcking.component.css'
})
export class ListParckingComponent implements OnInit {
  @ViewChild(ConfirmationAlertComponent) confirmation!: ConfirmationAlertComponent;
  parkings: Parking[] = [];
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  searchText : string = "";
  active? : boolean = undefined;

  parkingsActiveInput? : boolean = true;
  parkingsNonActiveInput? : boolean = true;

  constructor(
    private parkingService: ParkingService,
    private loadingService: LoadingService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | PARKINGS-LIST');
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

  parkingIdToDelete: number | null = null;


  deleteParking(typeId: number): void {
    this.parkingIdToDelete = typeId; 
    this.confirmation.changeMessage('Are you sure you want to delete this Parking?');
  }

  onConfirmed(confirmed: boolean) {
    if (confirmed && this.parkingIdToDelete !== null) {
      this.parkingService.deleteParking(this.parkingIdToDelete).subscribe(
        () => {
          this.parkings = this.parkings.filter(p => p.id !== this.parkingIdToDelete);
          this.loadParkings();
          this.parkingIdToDelete = null;
        },
        (error: any) => {
          this.parkingIdToDelete = null;
        }
      );
    } else {
      this.parkingIdToDelete = null;
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
    if(!this.parkingsActiveInput && !this.parkingsNonActiveInput){
      this.parkings = [];
      return;
    }
    if(this.parkingsActiveInput && this.parkingsNonActiveInput){
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
