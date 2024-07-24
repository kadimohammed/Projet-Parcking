import { Component, OnInit } from '@angular/core';
import { Admin } from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  admin: Admin = {} as Admin;

  constructor(private adminService: AdminService,private authService:AuthService) { }

  ngOnInit() {
    this.admin = this.adminService.getUser();
  }

  logOut(){
    this.authService.logout();
  }

  getRatingArray(): number[] {
    return Array.from({ length: this.admin.rating }, (_, i) => i + 1);
  }
}
