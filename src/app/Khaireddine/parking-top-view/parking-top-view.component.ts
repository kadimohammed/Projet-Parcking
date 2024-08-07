import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-parking-top-view',
  templateUrl: './parking-top-view.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./parking-top-view.component.css']
})
export class ParkingTopViewComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  color: string = '#ff0000'; // Add this line to declare the color property

  private ctx!: CanvasRenderingContext2D;
  private image: HTMLImageElement | null = null;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private rectangles: any[] = [];
  private selectedRect: any = null;
  private currentTool = 'rectangle';
  private scale = 1;
  private panX = 0;
  private panY = 0;
  private isPanning = false;
  private history: any[][] = [];
  private historyIndex = -1;
  private textureImage: HTMLImageElement | null = null;
  private currentPoints: { x: number; y: number }[] = [];

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resetCanvasAndImage();
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = new Image();
        this.image.onload = () => {
          this.resetCanvasAndImage();
        };
        this.image.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onTextureUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.textureImage = new Image();
        this.textureImage.onload = () => {
          this.redrawCanvas();
        };
        this.textureImage.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.scale;
    const y = (event.clientY - rect.top) / this.scale;

    if (this.currentTool === 'move') {
      for (let i = this.rectangles.length - 1; i >= 0; i--) {
        if (this.isPointInRect(x, y, this.rectangles[i])) {
          this.selectedRect = this.rectangles[i];
          this.isDrawing = true;
          [this.startX, this.startY] = [x, y];
          return;
        }
      }
      this.isPanning = true;
      [this.startX, this.startY] = [event.clientX, event.clientY];
    } else if (this.currentTool === 'rectangle') {
      this.isDrawing = true;
      [this.startX, this.startY] = [x, y];
    }
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.scale;
    const y = (event.clientY - rect.top) / this.scale;

    if (this.isPanning) {
      this.panX += event.clientX - this.startX;
      this.panY += event.clientY - this.startY;
      [this.startX, this.startY] = [event.clientX, event.clientY];
      this.updateCanvasPosition();
    } else if (this.isDrawing) {
      if (this.currentTool === 'move' && this.selectedRect) {
        this.selectedRect.x += x - this.startX;
        this.selectedRect.y += y - this.startY;
        [this.startX, this.startY] = [x, y];
      } else if (this.currentTool === 'rectangle') {
        this.redrawCanvas();
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
      }
    }
  }

  onMouseUp(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.scale;
    const y = (event.clientY - rect.top) / this.scale;

    if (this.isDrawing && this.currentTool === 'rectangle') {
      this.rectangles.push({
        x: Math.min(this.startX, x),
        y: Math.min(this.startY, y),
        width: Math.abs(x - this.startX),
        height: Math.abs(y - this.startY),
        color: this.color,
        angle: 0
      });
      this.saveToHistory();
    } else if (this.currentTool === 'move' && this.selectedRect) {
      this.saveToHistory();
    }
    this.isDrawing = false;
    this.isPanning = false;
    this.selectedRect = null;
    this.redrawCanvas();
  }

  onClick(event: MouseEvent) {
    if (this.currentTool === 'polygon') {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / this.scale;
      const y = (event.clientY - rect.top) / this.scale;
      this.currentPoints.push({ x, y });
      this.redrawCanvas();
    }
  }

  onRotate() {
    if (this.selectedRect) {
      this.selectedRect.angle += Math.PI / 4;
      this.saveToHistory();
      this.redrawCanvas();
    }
  }

  onDownload() {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }

  setTool(tool: string) {
    this.currentTool = tool;
    if (tool === 'polygon') {
      this.currentPoints = [];
    }
  }

  onZoomIn() {
    this.scale *= 1.1;
    this.updateCanvasScale();
  }

  onZoomOut() {
    this.scale /= 1.1;
    this.updateCanvasScale();
  }

  onResetZoom() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateCanvasScale();
    this.updateCanvasPosition();
  }

  // Change this method to public
  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    if (this.image) {
      const imageAspectRatio = this.image.width / this.image.height;
      const canvasAspectRatio = this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imageAspectRatio > canvasAspectRatio) {
        drawWidth = this.canvasRef.nativeElement.width;
        drawHeight = drawWidth / imageAspectRatio;
        offsetX = 0;
        offsetY = (this.canvasRef.nativeElement.height - drawHeight) / 2;
      } else {
        drawHeight = this.canvasRef.nativeElement.height;
        drawWidth = drawHeight * imageAspectRatio;
        offsetX = (this.canvasRef.nativeElement.width - drawWidth) / 2;
        offsetY = 0;
      }

      this.ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
    }

    this.drawCurrentPolygon();
    this.rectangles.forEach(rect => this.drawRotatedRect(rect));
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

    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateCanvasScale();
    this.updateCanvasPosition();
    this.redrawCanvas();
  }

  private updateCanvasScale() {
    this.canvasRef.nativeElement.style.transform = `scale(${this.scale})`;
    this.canvasRef.nativeElement.style.transformOrigin = 'top left';
  }

  private updateCanvasPosition() {
    this.canvasRef.nativeElement.style.left = `${this.panX}px`;
    this.canvasRef.nativeElement.style.top = `${this.panY}px`;
  }

  private drawRotatedRect(rect: any) {
    this.ctx.save();
    this.ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
    this.ctx.rotate(rect.angle);

    if (this.textureImage) {
      this.ctx.drawImage(
        this.textureImage,
        -rect.width / 2,
        -rect.height / 2,
        rect.width,
        rect.height
      );
    } else {
      this.ctx.fillStyle = rect.color;
      this.ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
    }

    this.ctx.restore();
  }

  private drawCurrentPolygon() {
    if (this.currentPoints.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentPoints[0].x, this.currentPoints[0].y);
      for (let i = 1; i < this.currentPoints.length; i++) {
        this.ctx.lineTo(this.currentPoints[i].x, this.currentPoints[i].y);
      }
      this.ctx.closePath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'purple';
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgba(128, 0, 128, 0.3)';
      this.ctx.fill();
    }
  }

  private isPointInRect(x: number, y: number, rect: any) {
    const dx = x - (rect.x + rect.width / 2);
    const dy = y - (rect.y + rect.height / 2);
    const rotatedX = dx * Math.cos(-rect.angle) - dy * Math.sin(-rect.angle);
    const rotatedY = dx * Math.sin(-rect.angle) + dy * Math.cos(-rect.angle);
    return (
      Math.abs(rotatedX) <= rect.width / 2 &&
      Math.abs(rotatedY) <= rect.height / 2
    );
  }

  private saveToHistory() {
    this.historyIndex++;
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(JSON.parse(JSON.stringify(this.rectangles)));
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.rectangles = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.redrawCanvas();
    }
  }

  generateXml() {
    const builder = new xml2js.Builder();
    const xmlObject = {
      parking: {
        space: this.rectangles.map((rect, index) => ({
          $: { id: index + 1, occupied: '0' },
          rotatedRect: {
            center: { $: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } },
            size: { $: { w: rect.width, h: rect.height } },
            angle: { $: { d: (rect.angle * 180) / Math.PI } } // Convert radians to degrees
          },
          contour: {
            point: [
              { $: { x: rect.x, y: rect.y } },
              { $: { x: rect.x + rect.width, y: rect.y } },
              { $: { x: rect.x + rect.width, y: rect.y + rect.height } },
              { $: { x: rect.x, y: rect.y + rect.height } }
            ]
          }
        }))
      }
    };
    const xml = builder.buildObject(xmlObject);
    this.downloadXmlFile(xml);
  }

  private downloadXmlFile(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'parking_data.xml';
    link.click();
  }
}
