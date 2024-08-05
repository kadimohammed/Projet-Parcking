import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as xml2js from 'xml2js';
import { ParkingService } from '../../core/services/parking.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Parking } from '../../core/models/parcking.model';

@Component({
  selector: 'app-camera-view',
  templateUrl: './camera-view.component.html',
  styleUrls: ['./camera-view.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CameraViewComponent implements OnInit, AfterViewInit {
  parking: Parking = {} as Parking;
  ParkingPhotoView: any;
  parkingId: number = 0;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private image !: HTMLImageElement;

  color: string = '#ff0000';

  constructor(
    private parkingService: ParkingService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.parkingId = +this.route.snapshot.paramMap.get('id')!;
    this.getParking(this.parkingId);
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
  }

  getParking(id: number): void {
    this.parkingService.getParking(id).subscribe({
      next: (data) => {
        this.parking = data;
        console.log("ddddddddd"+ JSON.stringify(data) );
        this.loadImageToCanvas();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading parking', error);
      }
    });
  }


  loadImageToCanvas(): void {
    console.log("dakhala");
    this.ParkingPhotoView = this.parking.photoParkings && this.parking.photoParkings.length > 0 ? this.parking.photoParkings[3].photo.path : '';
    this.ParkingPhotoView = "https://localhost:7009/files/ParkingsImages/" + this.ParkingPhotoView;
    
    if (this.ParkingPhotoView) {
      this.image = new Image();
      this.image.src = this.ParkingPhotoView;
      
      this.image.onload = () => {
        this.resetCanvasAndImage();
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
        this.drawLots();
        
      };
  
      this.image.onerror = (error) => {
        console.error('Error loading image:', error);
      };
    }
  }
  

  

  private resetCanvasAndImage() {
    const canvas = this.canvasRef.nativeElement;
    const containerWidth = canvas.parentElement?.clientWidth || 0;
    const containerHeight = canvas.parentElement?.clientHeight || 0;
  
    if (this.image) {
      const imageAspectRatio = this.image.width / this.image.height;
      const containerAspectRatio = containerWidth / containerHeight;
  
      let newWidth, newHeight;
  
      if (imageAspectRatio > containerAspectRatio) {
        newWidth = containerWidth;
        newHeight = containerWidth / imageAspectRatio;
      } else {
        newHeight = containerHeight;
        newWidth = containerHeight * imageAspectRatio;
      }
  
      canvas.width = newWidth;
      canvas.height = newHeight;
    } else {
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    }
  }

  drawLots(): void {
    this.parking.lots?.forEach(lot => {
      if (lot.points) {
        this.ctx.beginPath();
        this.ctx.moveTo(lot.points[0].x, lot.points[0].y);
        
        this.color = "#000";
        
        // Draw lines between the points
        lot.points.forEach(point => {
          this.ctx.lineTo(point.x, point.y);
        });
  
        this.ctx.closePath();
        this.ctx.strokeStyle = this.color; // Use the color defined in your component
        this.ctx.lineWidth = 2; // Set line width
        this.ctx.stroke(); // Draw the outline
  
        // Optionally fill the lot if it's available
        console.log(lot.disponibility);
        if (!lot.disponibility) {
          this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red fill for unavailable lots
           // Fill the lot area
           this.ctx.fill();
        }
        else
        {
          this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'; 
          this.ctx.fill();
        }
        
      }
    });
  }


  onImageUpload(event: Event) {

  }

  onTextureUpload(event: Event) {

  }

  onMouseDown(event: MouseEvent) {

  }

  onMouseMove(event: MouseEvent) {

  }

  onMouseUp(event: MouseEvent) {

  }

  onClick(event: MouseEvent) {

  }

  onRotate() {

  }

  

  setTool(tool: string) {

  }

  

  redrawCanvas() {
  
  }




  onZoomIn() {
  
  }

  onZoomOut() {
   
  }

  onResetZoom() {

  }


  undo() {
   
  }

  generateXml() {
    
  }



  onDownload() {

  }
}
