import { Component, OnInit, ViewChild } from '@angular/core';
import { Artisan } from '../../core/models/Artisan.model';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { ArtisanService } from '../../core/services/artisan.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ServiceEtat } from '../../core/models/service-etat.enum';

@Component({
  selector: 'app-details-Artisan',
  standalone: true,
  imports: [AlertMessageComponent,RouterLink,CommonModule],
  templateUrl: './details-Artisan.component.html',
  styleUrls: ['./details-Artisan.component.css'],
})
export class DetailsArtisanComponent implements OnInit {

  Artisan: Artisan = {} as Artisan;
  artisanId : number = 0;
  totalCount: number = 0;
  stateCounts: { [key: string]: number } = {};
  ServiceEtat = ServiceEtat;

  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;


  constructor(
    private artisanService: ArtisanService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.artisanId = +this.route.snapshot.paramMap.get('id')!;
    this.getArtisan(this.artisanId);
  }

  getArtisan(id:number): void {
    this.artisanService.getArtisansById(id).subscribe({
      next: (data) => {
        this.Artisan  = data;
        this.calculateServiceStates();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading artisan types', error);
      }
    });
  }


  calculateServiceStates(): void {
    if (this.Artisan.artisanClientServices) {
      this.totalCount = this.Artisan.artisanClientServices.length;
      this.stateCounts = this.Artisan.artisanClientServices.reduce((counts, service) => {
        const state = service.etat as ServiceEtat;
        counts[state] = (counts[state] || 0) + 1;
        return counts;
      }, {} as { [key in ServiceEtat]?: number });
    }
  }

  getPercentage(state: ServiceEtat): number {
    return this.stateCounts[state] ? (this.stateCounts[state] / this.totalCount) * 100 : 0;
  }


}
