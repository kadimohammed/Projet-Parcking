import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XmlService {
  generateXml(rectangles: any[]): string {
    // Implement XML generation logic here
    return '<xml></xml>'; // Placeholder
  }

  parseXml(xmlString: string): any[] {
    // Implement XML parsing logic here
    return []; // Placeholder
  }
}