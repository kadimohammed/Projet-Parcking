import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService1 {
  constructor(private http: HttpClient) {}

  uploadImages(images: File[]): Observable<string[]> {
    const formData: FormData = new FormData();
    images.forEach(image => formData.append('files', image, image.name));
    return this.http.post<string[]>('/api/upload', formData);
  }

  handleFileChange(event: Event, form: FormGroup): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const photoParkingsControl = form.get('photoParkings');
      if (photoParkingsControl) {
        photoParkingsControl.setValue(files);
      } else {
        console.error('photoParkings control is not defined');
      }
    }
  }
  
}
