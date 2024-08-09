import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private image: HTMLImageElement | null = null;
  private textureImage: HTMLImageElement | null = null;
  private scale = 1;
  private panX = 0;
  private panY = 0;
  private imageScale = 1;
  private imageOffsetX = 0;
  private imageOffsetY = 0;

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resetCanvasAndImage();
  }
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
  handleImageUpload(event: Event) {
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

  handleTextureUpload(event: Event) {
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

  zoomIn() {
    this.scale *= 1.1;
    this.updateCanvasScale();
  }

  zoomOut() {
    this.scale /= 1.1;
    this.updateCanvasScale();
  }

  resetZoom() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateCanvasScale();
    this.updateCanvasPosition();
  }

  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.image) {
      const imageAspectRatio = this.image.width / this.image.height;
      const canvasAspectRatio = this.canvas.width / this.canvas.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imageAspectRatio > canvasAspectRatio) {
        drawWidth = this.canvas.width;
        drawHeight = drawWidth / imageAspectRatio;
        offsetX = 0;
        offsetY = (this.canvas.height - drawHeight) / 2;
      } else {
        drawHeight = this.canvas.height;
        drawWidth = drawHeight * imageAspectRatio;
        offsetX = (this.canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      this.imageScale = drawWidth / this.image.width;
      this.imageOffsetX = offsetX;
      this.imageOffsetY = offsetY;

      this.ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
    }
  }

  drawRotatedRect(rect: any) {
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

  drawCurrentPolygon(currentPoints: { x: number; y: number }[]) {
    if (currentPoints.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        this.ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      this.ctx.closePath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'purple';
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgba(128, 0, 128, 0.3)';
      this.ctx.fill();
    }
  }

  getCanvasCoordinates(event: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / this.scale,
      y: (event.clientY - rect.top) / this.scale
    };
  }

  getScaledRectDimensions(rect: any) {
    const centerX = (rect.x + rect.width / 2 - this.imageOffsetX) / this.imageScale;
    const centerY = (rect.y + rect.height / 2 - this.imageOffsetY) / this.imageScale;
    const width = rect.width / this.imageScale;
    const height = rect.height / this.imageScale;
    return { x: rect.x / this.imageScale, y: rect.y / this.imageScale, centerX, centerY, width, height };
  }

  private resetCanvasAndImage() {
    const containerWidth = this.canvas.parentElement?.clientWidth || 0;
    const containerHeight = this.canvas.parentElement?.clientHeight || 0;

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

      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
    } else {
      this.canvas.width = containerWidth;
      this.canvas.height = containerHeight;
    }

    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateCanvasScale();
    this.updateCanvasPosition();
    this.redrawCanvas();
  }

  private updateCanvasScale() {
    this.canvas.style.transform = `scale(${this.scale})`;
    this.canvas.style.transformOrigin = 'top left';
  }

  private updateCanvasPosition() {
    this.canvas.style.left = `${this.panX}px`;
    this.canvas.style.top = `${this.panY}px`;
  }
}
