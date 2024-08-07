import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanvasService } from '../services/Canvas.service';
import { ShapeService } from '../services/shape.service';
import { XmlService } from '../services/Xml.service';

@Component({
  selector: 'app-parking-top-view',
  templateUrl: './parking-top-view.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./parking-top-view.component.css']
})
export class ParkingTopViewComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  color: string = '#ff0000';
  currentTool: string = 'rectangle';

  constructor(
    private canvasService: CanvasService,
    private shapeService: ShapeService,
    private xmlService: XmlService
  ) {}

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
    this.xmlService.generateAndDownloadXml();
  }
}
