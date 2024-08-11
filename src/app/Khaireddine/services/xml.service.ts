import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { ShapeService } from './shape.service';
import { CanvasService } from './Canvas.service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmlService {
  private apiUrl = 'https://localhost:7009/api/Parkings';

  constructor(
    private shapeService: ShapeService,
    private canvasService: CanvasService,
    private http: HttpClient
  ) {}
  generateDownloadAndUploadXml(parkingId: string): Observable<any> {
    console.log('Starting XML generation and upload');
    const builder = new xml2js.Builder();
    const xmlObject = this.createXmlObject(parkingId);
    console.log('XML Object Created:', xmlObject);
    const xml = builder.buildObject(xmlObject);
    console.log('XML String Generated:', xml);

    this.downloadXmlFile(xml, parkingId);
    console.log('XML File Downloaded');

    const uploadObservable = this.uploadXmlFile(xml, parkingId).pipe(
      tap(response => console.log('Upload successful:', response)),
      catchError(error => {
        console.error('Error uploading XML:', error);
        return throwError(error);
      })
    );

    console.log('Attempting to upload XML file');
    return uploadObservable;
  }




  private createXmlObject(parkingId: string) {
    return {
      parking: {
        $: { id: parkingId },
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

  private downloadXmlFile(xml: string, parkingId: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parking_data_${parkingId}.xml`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private uploadXmlFile(xml: string, parkingId: string): Observable<any> {
    console.log('Preparing to upload XML file');
    const blob = new Blob([xml], { type: 'application/xml' });
    const file = new File([blob], `parking_data_${parkingId}.xml`, { type: 'application/xml' });
    const formData = new FormData();
    formData.append('file', file);

    // Log the FormData contents
   // Log each form data entry
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });


    return this.http.post(`${this.apiUrl}/${parkingId}/xmltopview`, formData, {
      headers: { 'Accept': '*/*' }, // Content-Type is automatically set by FormData
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Server Response:', response)),
      catchError(error => {
        console.error('Error uploading XML:', error);
        return throwError(error);
      })
    );
}




}
