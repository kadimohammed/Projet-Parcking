import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ParkingService } from '../../core/services/parking.service';
import { Parking } from '../../core/models/parcking.model';
import { ArtisanService } from '../../core/services/artisan.service';
import { Artisan } from '../../core/models/Artisan.model';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';
import { AuthService } from '../../core/services/AuthService.service';
import { Admin } from '../../core/models/admin.model';
import { Chart,BarController,ArcElement,LineController,DoughnutController ,PointElement,LineElement ,CategoryScale , LinearScale, BarElement, Title, Tooltip, Legend, ChartConfiguration } from 'chart.js';
import { StatisticsService } from '../../core/services/statistics.service';
import { ArtisanClientService } from '../../core/models/artisan-client-service.model';
import { ServiceEtat } from '../../core/models/service-etat.enum';
import { Lot } from '../../core/models/lot.model';
import { ClientParking } from '../../core/models/client-parking.model';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';
import { ClientParkingStatisticVM } from '../../core/ViewModels/ClientParkingStatisticVM';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf,NgClass,NgFor,NgStyle],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit  {

  Parkings : Parking[] = [];
  Artisans : Artisan[] = [];
  Clients : Client[] = [];
  Admins : Admin[] = [];
  Lots : Lot[] = [];
  ClientParking : ClientParking[] = [];
  ArtisanClientService : ArtisanClientService[] = [];
  ParkingsByDayOfWeek : number[] = [];
  clientParkingStatisticVM : ClientParkingStatisticVM[] = [];

  constructor(
    private parkingService : ParkingService,
    private artisanService : ArtisanService,
    private clientService : ClientService,
    private adminService : AuthService,
    private statisticsService : StatisticsService,
    private loadingService: LoadingService
  ){
    Chart.register(LinearScale,ArcElement,CategoryScale,DoughnutController , LineController, PointElement ,LineElement, BarElement,BarController, Title, Tooltip, Legend);

  }

  ngOnInit(): void {
    this.loadingService.show();
    this.getParkings();
    this.getArtisans();
    this.getClients();
    this.getAdmins();
    this.getLots();
    this.getParkedClients();
    this.GetAllArtisanClientServices();
    this.getParkingsByDayOfWeek();
    this.getgetClientsByParking();
  }

  getParkingColor(index: number): string {
    switch (index) {
        case 0: return '#71dd37'; // Couleur pour le premier parking
        case 1: return '#03c3ec'; // Couleur pour le deuxième parking
        case 2: return '#696cff'; // Couleur pour le troisième parking
        case 3: return '#ffab00'; // Couleur pour le quatrième parking
        default: return '#000';    // Couleur par défaut
    }
}


  GetAllArtisanClientServices(){
    this.statisticsService.getArtisanClientServices().subscribe({
      next: (data) => {
        this.ArtisanClientService = data;
        this.createServicesChart();
      },
      error: (error: HttpErrorResponse) => {
    }});
  }


  getParkingsByDayOfWeek() {
    this.statisticsService.getParkingsByDayOfWeek().subscribe({
      next:(data) => { // Spécifiez le type attendu ici
        this.ParkingsByDayOfWeek = data;
        this.createDayOfWeekChart();
      },
      error: (error) => {
        console.error('Error fetching parking data', error);
      }
    });
  }



  getgetClientsByParking() {
    this.statisticsService.getClientsByParking().subscribe({
      next:(data) => { 
        this.clientParkingStatisticVM = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching parking data', error);
      }
    });
  }

  calculateTotalClients(): number {
    return this.clientParkingStatisticVM.reduce((total, parking) => {
        return total + (parseInt(parking.clientCount) || 0);
    }, 0);
  }
  

  createDayOfWeekChart() {
    const labels = Object.keys(this.ParkingsByDayOfWeek);
    const data = Object.values(this.ParkingsByDayOfWeek);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Parkings actifs par jour',
        data: data,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(255, 206, 86)'
        ],
        hoverOffset: 4
      }]
    };

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: chartData,
    };

    const ctx = document.getElementById('dayChart') as HTMLCanvasElement;
    new Chart(ctx, config);
}



  getParkings(){
    this.parkingService.getAllParkings().subscribe({
      next: (data) => {
        this.Parkings = data;
        this.loadingService.hide();
      },
      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();
    }});
  }


  getParkedClients(){
    this.statisticsService.getParkedClient().subscribe({
      next: (data) => {
        this.ClientParking = data;
        this.createDurationChart();
      },
      error: (error: HttpErrorResponse) => {
    }});
  }

  getLots(){
    this.statisticsService.getLots().subscribe({
      next: (data) => {
        this.Lots = data;
      },
      error: (error: HttpErrorResponse) => {
    }});
  }

  


  getArtisans(){
    this.artisanService.getArtisans().subscribe({
      next: (data) => {
        this.Artisans = data;
      },
      error: (error: HttpErrorResponse) => {
    }});
  }


  getClients(){
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.Clients = data;
      },
      error: (error: HttpErrorResponse) => {
    }});
  }


  getAdmins(){
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        this.Admins = data;
      },
      error: (error: HttpErrorResponse) => {
    }});
  }



  getClientActive() : number {
      return this.Clients.filter(client => client.active).length;
  }

  getClientNonActive() : number {
    return this.Clients.filter(client => !client.active).length;
  }


  getArtisanActive() : number {
    return this.Artisans.filter(ar => ar.active).length;
  }
  
  getArtisanNonActive() : number {
    return this.Artisans.filter(ar => !ar.active).length;
  }


  getParkingsActive() : number {
    return this.Parkings.filter(p => p.isWorking).length;
  }
  
  getParkingsNonActive() : number {
    return this.Parkings.filter(p => !p.isWorking).length;
  }

  getLotsActive() : number {
    return this.Lots.filter(p => p.disponibility).length;
  }
  
  getLotsNonActive() : number {
    return this.Lots.filter(p => !p.disponibility).length;
  }

  

  getServiceCountsByEtat(): { [key: string]: number } {
    return this.ArtisanClientService.reduce((acc, service) => {
      const etatKey = ServiceEtat[service.etat]; 
      acc[etatKey] = (acc[etatKey] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }
  


  createServicesChart() {
    const ctx = document.getElementById('artisanChart') as HTMLCanvasElement;
  
    if (ctx && this.ArtisanClientService.length > 0) {
      const serviceCounts = this.getServiceCountsByEtat();
      const labels = Object.keys(serviceCounts);
      const data = Object.values(serviceCounts);
  
      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nombre de Services',
            data: data,
            backgroundColor: [
              'rgba(255, 62, 29, 0.6)',
              'rgba(3, 195, 236, 0.6)',
              'rgba(113, 221, 55, 0.6)',
              'rgba(133, 146, 163, 0.6)',
              'rgba(255, 171, 0, 0.6)'
            ],
            borderColor: [
              'rgba(255, 62, 29, 1)',
              'rgba(3, 195, 236, 1)',
              'rgba(113, 221, 55, 1)',
              'rgba(133, 146, 163, 1)',
              'rgba(255, 171, 0, 1)'
            ],
            borderWidth: 1,
            borderRadius: 70
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };
  
      const artisanChart = new Chart(ctx, config);
      console.log('Chart created successfully');
    } else {
      console.error('Canvas element not found or data is empty');
    }
  }



  createDurationChart() {
    const ctx = document.getElementById('durationChart') as HTMLCanvasElement;
  
    if (ctx && this.ClientParking.length > 0) {
      // Définir les intervalles horaires de 0:00 à 23:00 (chaque intervalle représente 1 heure)
      const intervals = Array.from({ length: 24 }, (_, i) => ({
        label: `${i}:00 - ${i + 1}:00`,
        min: i,
        max: i + 1
      }));
  
      // Initialiser les comptes pour chaque intervalle à zéro
      const intervalCounts = Array(intervals.length).fill(0);
  
      // Calculer le nombre de stationnements par heure
      this.ClientParking.forEach(parking => {
        const parkingDate = new Date(parking.datePark);
        const parkingHour = parkingDate.getUTCHours();
  
        if (parkingHour >= 0 && parkingHour < 24) {
          intervalCounts[parkingHour] += 1; // Incrémentez le compte de l'intervalle correspondant
        }
      });

  
      const data = {
        labels: intervals.map(interval => interval.label),
        datasets: [{
          label: 'Nombre de Clients',
          data: intervalCounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        }]
      };
  
      const options = {
        responsive: true,
        plugins: {
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de Clients'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Intervalles de Temps'
            }
          }
        }
      };
  
      const durationChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
  
      console.log('Duration chart created successfully');
    } else {
      console.error('Canvas element not found or data is empty');
    }
  }
  
  
  
  
  
  


}
