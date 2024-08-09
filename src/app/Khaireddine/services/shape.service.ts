import { Injectable } from '@angular/core';
import { CanvasService } from './Canvas.service';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private rectangles: any[] = [];
  private selectedRect: any = null;
  private isPanning = false;
  private currentPoints: { x: number; y: number }[] = [];
  private history: any[][] = [];
  private historyIndex = -1;

  constructor(private canvasService: CanvasService) {}

  handleMouseDown(event: MouseEvent, currentTool: string) {
    const { x, y } = this.canvasService.getCanvasCoordinates(event);

    if (currentTool === 'move') {
      this.handleMoveToolMouseDown(x, y, event);
    } else if (currentTool === 'rectangle') {
      this.isDrawing = true;
      [this.startX, this.startY] = [x, y];
    }
  }

  handleMouseMove(event: MouseEvent, currentTool: string) {
    const { x, y } = this.canvasService.getCanvasCoordinates(event);

    if (this.isPanning) {
      this.handlePanning(event);
    } else if (this.isDrawing) {
      this.handleDrawing(x, y, currentTool);
    }
  }

  handleMouseUp(event: MouseEvent, currentTool: string, color: string) {
    const { x, y } = this.canvasService.getCanvasCoordinates(event);

    if (this.isDrawing && currentTool === 'rectangle') {
      this.createRectangle(x, y, color);
    } else if (currentTool === 'move' && this.selectedRect) {
      this.saveToHistory();
    }
    this.isDrawing = false;
    this.isPanning = false;
    this.selectedRect = null;
    this.canvasService.redrawCanvas();
    this.redrawShapes();
  }

  handleClick(event: MouseEvent, currentTool: string) {
    if (currentTool === 'polygon') {
      const { x, y } = this.canvasService.getCanvasCoordinates(event);
      this.currentPoints.push({ x, y });
      this.canvasService.redrawCanvas();
      this.redrawShapes();
    }
  }

  setTool(tool: string) {
    if (tool === 'polygon') {
      this.currentPoints = [];
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.rectangles = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.canvasService.redrawCanvas();
      this.redrawShapes();
    }
  }

  rotateSelected() {
    if (this.selectedRect) {
      this.selectedRect.angle += Math.PI / 4;
      this.saveToHistory();
      this.canvasService.redrawCanvas();
      this.redrawShapes();
    }
  }

  getRectangles() {
    return this.rectangles;
  }

  private handleMoveToolMouseDown(x: number, y: number, event: MouseEvent) {
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
  }

  private handlePanning(event: MouseEvent) {
    // Implement panning logic here
  }

  private handleDrawing(x: number, y: number, currentTool: string) {
    if (currentTool === 'move' && this.selectedRect) {
      this.selectedRect.x += x - this.startX;
      this.selectedRect.y += y - this.startY;
      [this.startX, this.startY] = [x, y];
    } else if (currentTool === 'rectangle') {
      this.canvasService.redrawCanvas();
      this.redrawShapes();
      const ctx = this.canvasService.getContext();
      ctx.strokeStyle = 'red';
      ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
    }
  }

  private createRectangle(x: number, y: number, color: string) {
    this.rectangles.push({
      x: Math.min(this.startX, x),
      y: Math.min(this.startY, y),
      width: Math.abs(x - this.startX),
      height: Math.abs(y - this.startY),
      color: color,
      angle: 0
    });
    this.saveToHistory();
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

  private redrawShapes() {
    this.rectangles.forEach(rect => this.canvasService.drawRotatedRect(rect));
    this.canvasService.drawCurrentPolygon(this.currentPoints);
  }
}
