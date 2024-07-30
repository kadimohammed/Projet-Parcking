import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  private maxSizeInMB = 5;
  private maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;

  validateFiles(files: FileList): { isValid: boolean; invalidFiles?: string[] } {
    let isValid = true;
    const invalidFiles: string[] = [];

    if (files.length > 5) {
      isValid = false;
      invalidFiles.push(`You can only upload a maximum of 5 files.`);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.slice((file.name.lastIndexOf(".")) + 1).toLowerCase();
      const fileSize = file.size;

      if (!this.allowedExtensions.includes('.' + fileExtension)) {
        isValid = false;
        invalidFiles.push(`File "${file.name}" has an invalid extension.`);
      }

      if (fileSize > this.maxSizeInBytes) {
        isValid = false;
        invalidFiles.push(`File "${file.name}" exceeds the maximum size of ${this.maxSizeInMB} MB.`);
      }
    }

    return { isValid, invalidFiles };
  }

  handleFileChange(event: Event, form: FormGroup) {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const { isValid, invalidFiles } = this.validateFiles(files);

      if (isValid) {
        form.get('photoParkings')?.setValue(files);
        form.get('photoParkings')?.setErrors(null);
      } else {
        form.get('photoParkings')?.setErrors({ invalidFiles: { errors: invalidFiles } });
      }
    } else {
      form.get('photoParkings')?.setErrors({ required: true });
    }
  }
  
  
}
