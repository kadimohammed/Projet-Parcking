import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '../services/Canvas.service';
import { ShapeService } from '../services/shape.service';
import { XmlService } from '../services/Xml.service';
import { ParkingService } from '../services/parking.service';
import { Parking } from '../models/parking.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-parking-top-view',
  templateUrl: './parking-top-view.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./parking-top-view.component.css']
})
export class ParkingTopViewComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  color: string = '#ff0000';
  currentTool: string = 'rectangle';
  parkings: Parking[] = [];
  selectedParkingId: string = '';
  private parkingService: ParkingService;
  constructor(
    private canvasService: CanvasService,
    private shapeService: ShapeService,
    private xmlService: XmlService,
    private http: HttpClient

  ) {
    this.parkingService = ParkingService.getInstance(http);

  }
  ngOnInit() {
    this.loadParkings();
  }
  loadParkings() {
    this.parkingService.getParkings().subscribe(
      (data) => {
        this.parkings = data;
        this.updateSelectOptions();
      },
      (error) => {
        console.error('Error fetching parkings:', error);
      }
    );
  }

  updateSelectOptions() {
    const select = document.getElementById('parkingSelect') as HTMLSelectElement;
    select.innerHTML = '<option value="">Select a parking</option>';

    for (let parking of this.parkings) {
      const option = document.createElement('option');
      option.value = parking.id.toString();
      option.textContent = parking.nomParcking;
      select.appendChild(option);
    }
  }

  onParkingSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedParkingId = select.value;
  }
  ngAfterViewInit() {
    this.canvasService.initialize(this.canvasRef.nativeElement);
  }

  onImageUpload(event: Event) {
    this.canvasService.handleImageUpload(event);
  }

  onTextureUpload(event: Event) {
    this.canvasService.handleTextureUpload(event);
  }

  onMouseDown(event: MouseEvent) {
    this.shapeService.handleMouseDown(event, this.currentTool);
  }

  onMouseMove(event: MouseEvent) {
    this.shapeService.handleMouseMove(event, this.currentTool);
  }

  onMouseUp(event: MouseEvent) {
    this.shapeService.handleMouseUp(event, this.currentTool, this.color);
  }

  onClick(event: MouseEvent) {
    this.shapeService.handleClick(event, this.currentTool);
  }

  setTool(tool: string) {
    this.currentTool = tool;
    this.shapeService.setTool(tool);
  }

  onZoomIn() {
    this.canvasService.zoomIn();
  }

  onZoomOut() {
    this.canvasService.zoomOut();
  }

  onResetZoom() {
    this.canvasService.resetZoom();
  }

  undo() {
    this.shapeService.undo();
  }

  rotateSelected() {
    this.shapeService.rotateSelected();
  }

  generateXml() {
    if (this.selectedParkingId) {
      this.xmlService.generateDownloadAndUploadXml(this.selectedParkingId);
    } else {
      alert('No parking selected');
    }
  }
}
