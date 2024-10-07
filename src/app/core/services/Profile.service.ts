// profile.service.ts
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../models/admin.model'; // Assurez-vous d'importer le modèle Admin correctement
import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements OnInit {
  public adminSubject : Admin = {} as Admin;

  constructor(private authService:AuthService) {}

  ngOnInit(): void {
    this.adminSubject = this.authService.getUser();
  }

  
  updateAdmin(adm: Admin) {
    if (adm) {
      this.adminSubject = adm;
    }
  }

}
