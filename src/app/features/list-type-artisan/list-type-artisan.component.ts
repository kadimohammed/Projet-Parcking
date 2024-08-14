import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypeArtisan } from '../../core/models/TypeArtisan.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageState } from '../../core/ViewModels/MessageState';
import { ArtisanTypesService } from '../../core/services/ArtisanTypes.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-list-type-artisan',
  standalone: true,
  imports: [RouterLink,NgFor,CommonModule],
  templateUrl: './list-type-artisan.component.html',
  styleUrl: './list-type-artisan.component.css'
})
export class ListTypeArtisanComponent implements OnInit{
  ArtisanTypes: TypeArtisan[] = [];
  FullArtisanTypes: TypeArtisan[] = [];

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  searchText: string = '';
  message : MessageState = {message :'',state:true};

  constructor(
    private artisanTypeService:ArtisanTypesService,
    private loadingService: LoadingService
  ){

  }

  ngOnInit(): void {
    this.loadingService.show();
    this.loadArtisanTypes();
  }

  loadArtisanTypes(): void {
    this.artisanTypeService.getArtisanTypes().subscribe({
      next: (data) => {
        this.loadingService.hide();
        this.ArtisanTypes = data;
        this.updatePaginatedArtisanTypes();
        this.changeMessage('',true);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();
        this.changeMessage(this.artisanTypeService.errorMessage,false);
    }});
  }

  changeMessage(Msg:string,etat:boolean){
    this.message.message = Msg;
    this.message.state = etat;
    setTimeout(() => {
      this.message.message = '';
    }, 3000);
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


  deleteArtisanType(typeId : number){
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type ?')) {
      this.artisanTypeService.deleteArtisanType(typeId).subscribe(
        () => {
          this.ArtisanTypes = this.ArtisanTypes.filter(p => p.id !== typeId);
          this.FullArtisanTypes = this.FullArtisanTypes.filter(p => p.id !== typeId);
          this.changeMessage('Type Artisan supprimé avec succès.',true);
        },
        (error: any) => {
          this.changeMessage(this.artisanTypeService.errorMessage,false);
        }
      );
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
