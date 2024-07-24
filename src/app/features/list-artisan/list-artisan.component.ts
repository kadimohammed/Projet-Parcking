import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { CommonModule, NgFor } from '@angular/common';
import { ArtisansListVM } from '../../core/ViewModels/ArtisansListVM';
import { ArtisanService } from '../../core/services/artisan.service';
import { Artisan } from '../../core/models/Artisan.model';

@Component({
  selector: 'app-list-artisan',
  standalone: true,
  imports: [RouterLink,NgFor,CommonModule,TimeFormatPipe],
  templateUrl: './list-artisan.component.html',
  styleUrl: './list-artisan.component.css'
})
export class ListArtisanComponent {

  Artisans: ArtisansListVM[] = [];

  constructor(private artisanService: ArtisanService) { }

  ngOnInit(): void {
    console.log("ngOnInit() method called");
    this.artisanService.getArtisans().subscribe(
      data => {
        console.log("Data received in component:", data);
        this.Artisans = data;
      },
      error => {
        console.error("Error occurred while fetching data:", error);
      }
    );
  }



  deleteArtisan(arisanId : number){

  }

}
