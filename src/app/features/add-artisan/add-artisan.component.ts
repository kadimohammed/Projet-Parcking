import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParkingFormService } from '../../core/FormService/ParkingForm.service';
import { ArtisanFormService } from '../../core/FormService/ArtisanForm.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-artisan',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './add-artisan.component.html',
  styleUrl: './add-artisan.component.css'
})
export class AddArtisanComponent implements OnInit{
  addArtisanForm!: FormGroup;

  constructor(private artisanForm : ArtisanFormService){
  
  }

  ngOnInit(): void {
    this.addArtisanForm = this.artisanForm.createAddArtisanForm();
  }


  onSubmit(){

  }


}
