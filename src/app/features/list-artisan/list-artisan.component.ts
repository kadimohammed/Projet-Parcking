import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { CommonModule, NgFor } from '@angular/common';
import { ArtisanService } from '../../core/services/artisan.service';
import { Artisan } from '../../core/models/Artisan.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageState } from '../../core/ViewModels/MessageState';
import { NgModel } from '@angular/forms';
import { LoadingService } from '../../core/services/loading.service';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';

@Component({
  selector: 'app-list-artisan',
  standalone: true,
  imports: [RouterLink,NgFor,CommonModule,TimeFormatPipe,ConfirmationAlertComponent],
  templateUrl: './list-artisan.component.html',
  styleUrl: './list-artisan.component.css'
})
export class ListArtisanComponent implements OnInit {
  @ViewChild(ConfirmationAlertComponent) confirmation!: ConfirmationAlertComponent;
  Artisans: Artisan[] = [];
  FullArtisans: Artisan[] = [];
  paginatedArtisans: Artisan[] = [];
  message : MessageState = {message :'',state:true};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  searchText: string = '';

  ArtisanActiveInput? : boolean = true;
  ArtisanNonActiveInput? : boolean = true;

  artisanIdToDelete: number | null = null;

  constructor(
    private artisanService: ArtisanService,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadArtisans();
  }

  loadArtisans(): void {
    this.loadingService.show();
    this.artisanService.getArtisans().subscribe({
      next: (data) => {
        this.Artisans = data;
        this.FullArtisans = data;
        this.updatePaginatedArtisans();
        this.loadingService.hide();
      },
      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();
    }});
  }

  updatePaginatedArtisans(): void {
    this.totalCount = this.FullArtisans.length;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedArtisans = this.FullArtisans.slice(startIndex, startIndex + this.pageSize);
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedArtisans();
    }
  }


  changePageSize(pageSize : number){
    this.pageSize = pageSize;
    this.updatePaginatedArtisans();
  }


  deleteArtisan(typeId: number): void {
    this.artisanIdToDelete = typeId; 
    this.confirmation.changeMessage('Are you sure you want to delete this parking?');
  }

  onConfirmed(confirmed: boolean) {
    if (confirmed && this.artisanIdToDelete !== null) {
      this.artisanService.deleteArtisan(this.artisanIdToDelete).subscribe(
        () => {
          this.Artisans = this.Artisans.filter(p => p.id !== this.artisanIdToDelete);
          this.FullArtisans  = this.Artisans;
          this.updatePaginatedArtisans();
          this.artisanIdToDelete = null;
        },
        (error: any) => {
          this.artisanIdToDelete = null;
        }
      );
    } else {
      this.artisanIdToDelete = null;
    }
  }



  getArtisanActive(event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.ArtisanActiveInput = true;
    }else{
      this.ArtisanActiveInput = false;
    }
    this.searchArtisans(this.searchText);
  }

  getArtisanNonActive(event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.ArtisanNonActiveInput = true;
    }else{
      this.ArtisanNonActiveInput = false;
    }
    this.searchArtisans(this.searchText);
  }


  searchArtisans(text: string) {
    if(!this.ArtisanActiveInput && !this.ArtisanNonActiveInput){
      this.FullArtisans = [];
    }
    else if(this.ArtisanActiveInput && this.ArtisanNonActiveInput){
      this.FullArtisans = this.Artisans;
    }
    else if(this.ArtisanActiveInput){
      this.FullArtisans = this.Artisans.filter(artisan => artisan.active);
    }
    else{
      this.FullArtisans = this.Artisans.filter(artisan => !artisan.active);
    }

    this.searchText = text.trim().toLowerCase();
    if (this.searchText !== '') {
      this.FullArtisans = this.FullArtisans.filter(artisan => 
        artisan.email.toLowerCase().includes(this.searchText) || 
        artisan.nom.toLowerCase().includes(this.searchText) || 
        artisan.prenom.toLowerCase().includes(this.searchText) || 
        artisan.profession.toLowerCase().includes(this.searchText)|| 
        artisan.tel.toLowerCase().includes(this.searchText)|| 
        artisan.type.libelle.toLowerCase().includes(this.searchText)|| 
        artisan.rating.toString() == this.searchText
      );
    }
    this.currentPage = 1;
    this.updatePaginatedArtisans();
  }
  
  
}
