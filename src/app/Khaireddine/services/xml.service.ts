import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class XmlService {
  generateXml(rectangles: any[]): string {
    const builder = new xml2js.Builder();
    const xmlObject = {
      parking: {
        space: rectangles.map((rect, index) => ({
          $: { id: index + 1, occupied: '0' },
          rotatedRect: {
            center: { $: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } },
            size: { $: { w: rect.width, h: rect.height } },
            angle: { $: { d: (rect.angle * 180) / Math.PI } }
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
    return builder.buildObject(xmlObject);
  }

  downloadXmlFile(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'parking_data.xml';
    link.click();
  }
}