import { Injectable } from '@angular/core';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private admin: Admin = {} as Admin;
  private readonly USER_KEY = 'authUser';

  setUser(admin: Admin) {
    this.admin = admin;
    localStorage.setItem(this.USER_KEY, JSON.stringify(admin));
  }

  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
