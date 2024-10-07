import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  private maxSizeInMB = 1;
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
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const { isValid, invalidFiles } = this.validateFiles(files);

      if (isValid) {
        const photoArray = form.get('photoParkings') as FormArray;
        photoArray.clear();  // Clear any previous entries

        Array.from(files).forEach(file => {
          photoArray.push(new FormControl(file));
        });

        form.get('photoParkings')?.setErrors(null);
      } else {
        form.get('photoParkings')?.setErrors({ invalidFiles });
      }
    } else {
      form.get('photoParkings')?.setErrors({ required: true });
    }
  }
}
