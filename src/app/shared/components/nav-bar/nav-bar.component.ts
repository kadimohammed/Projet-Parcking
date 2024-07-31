import { Component, OnInit } from '@angular/core';
import { Admin } from '../../../core/models/admin.model';
import { AuthService } from '../../../core/services/AuthService.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  admin: Admin = {} as Admin;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.admin = this.authService.getUser();
  }

  logOut(){
    this.authService.logout();
  }

  getRatingArray(): number[] {
    return Array.from({ length: this.admin.rating }, (_, i) => i + 1);
  }
}
