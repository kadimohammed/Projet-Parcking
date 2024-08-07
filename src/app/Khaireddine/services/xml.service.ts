import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
import { ShapeService } from './shape.service';
import { CanvasService } from './Canvas.service';

@Injectable({
  providedIn: 'root'
})
export class XmlService {
  constructor(
    private shapeService: ShapeService,
    private canvasService: CanvasService
  ) {}

  generateAndDownloadXml() {
    const builder = new xml2js.Builder();
    const xmlObject = this.createXmlObject();
    const xml = builder.buildObject(xmlObject);
    this.downloadXmlFile(xml);
  }

  private createXmlObject() {
    return {
      parking: {
        space: this.shapeService.getRectangles().map((rect, index) => {
          const { centerX, centerY, width, height } = this.canvasService.getScaledRectDimensions(rect);
          return {
            $: { id: index + 1, occupied: '0' },
            rotatedRect: {
              center: { $: { x: centerX.toFixed(2), y: centerY.toFixed(2) } },
              size: { $: { w: width.toFixed(2), h: height.toFixed(2) } },
              angle: { $: { d: ((rect.angle * 180) / Math.PI).toFixed(2) } }
            },
            contour: {
              point: this.getContourPoints(rect)
            }
          };
        })
      }
    };
  }

  private getContourPoints(rect: any) {
    const { x, y, width, height } = this.canvasService.getScaledRectDimensions(rect);
    const angle = rect.angle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const cx = x + width / 2;
    const cy = y + height / 2;

    const points = [
      { dx: -width / 2, dy: -height / 2 },
      { dx: width / 2, dy: -height / 2 },
      { dx: width / 2, dy: height / 2 },
      { dx: -width / 2, dy: height / 2 }
    ];

    return points.map(p => {
      const rotatedX = p.dx * cos - p.dy * sin + cx;
      const rotatedY = p.dx * sin + p.dy * cos + cy;
      return { $: { x: rotatedX.toFixed(2), y: rotatedY.toFixed(2) } };
    });
  }

  private downloadXmlFile(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parking_data.xml';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
