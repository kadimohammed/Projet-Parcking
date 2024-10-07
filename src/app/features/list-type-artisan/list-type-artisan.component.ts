import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypeArtisan } from '../../core/models/TypeArtisan.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageState } from '../../core/ViewModels/MessageState';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { LoadingService } from '../../core/services/loading.service';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list-type-artisan',
  standalone: true,
  imports: [RouterLink,NgFor,CommonModule,ConfirmationAlertComponent],
  templateUrl: './list-type-artisan.component.html',
  styleUrl: './list-type-artisan.component.css'
})
export class ListTypeArtisanComponent implements OnInit{
  ArtisanTypes: TypeArtisan[] = [];
  FullArtisanTypes: TypeArtisan[] = [];
  @ViewChild(ConfirmationAlertComponent) confirmation!: ConfirmationAlertComponent;

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  searchText: string = '';
  message : MessageState = {message :'',state:true};

  typeIdToDelete: number | null = null;  // Stocke l'ID à supprimer

  constructor(
    private artisanTypeService:ArtisanTypesService,
    private loadingService: LoadingService,
    private titleService: Title
  ){

  }

  ngOnInit(): void {
    this.titleService.setTitle('LYPARK | TYPES-LIST');
    this.loadingService.show();
    this.loadArtisanTypes();
  }

  loadArtisanTypes(): void {
    this.artisanTypeService.getArtisanTypes().subscribe({
      next: (data) => {
        this.loadingService.hide();
        this.ArtisanTypes = data;
        this.updatePaginatedArtisanTypes();
      },
      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();
    }});
  }


  updatePaginatedArtisanTypes(): void {
    this.totalCount = this.ArtisanTypes.length;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.FullArtisanTypes = this.ArtisanTypes.slice(startIndex, startIndex + this.pageSize);
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedArtisanTypes();
    }
  }


  changePageSize(pageSize : number){
    this.pageSize = pageSize;
    this.updatePaginatedArtisanTypes();
  }


  deleteArtisanType(typeId: number): void {
    this.typeIdToDelete = typeId; 
    this.confirmation.changeMessage('Are you sure you want to delete this artisan type?');
  }

  onConfirmed(confirmed: boolean) {
    if (confirmed && this.typeIdToDelete !== null) {
      this.artisanTypeService.deleteArtisanType(this.typeIdToDelete).subscribe(
        () => {
          this.ArtisanTypes = this.ArtisanTypes.filter(p => p.id !== this.typeIdToDelete);
          this.FullArtisanTypes = this.FullArtisanTypes.filter(p => p.id !== this.typeIdToDelete);
          this.typeIdToDelete = null;
        },
        (error: any) => {
          this.typeIdToDelete = null;
        }
      );
    } else {
      this.typeIdToDelete = null;  // Réinitialiser si non confirmé
    }
  }

  searchArtisanTypes(text: string) {
    this.searchText = text.trim().toLowerCase();
    if (this.searchText !== '') {
      this.FullArtisanTypes = this.ArtisanTypes.filter(type => 
        type.libelle.toLowerCase().includes(this.searchText) || 
        type.id.toString().toLowerCase().includes(this.searchText)
      );
    } else {
      this.FullArtisanTypes = [...this.ArtisanTypes];
    }
    this.currentPage = 1;
    this.totalCount = this.FullArtisanTypes.length;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.FullArtisanTypes = this.FullArtisanTypes.slice(startIndex, startIndex + this.pageSize);
}



}
