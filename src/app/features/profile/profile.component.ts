import { Component, OnInit } from '@angular/core';
import { Admin } from '../../core/models/admin.model';
import { AuthService } from '../../core/services/AuthService.service';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ChangeProfileAdminVM } from '../../core/ViewModels/ChangeProfileAdminVM';
import { ChangePasswordAdminVM } from '../../core/ViewModels/ChangePasswordAdminVM';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  admin : Admin = {} as Admin;
  adminProfile: ChangeProfileAdminVM = {} as ChangeProfileAdminVM;
  adminPassword: ChangePasswordAdminVM = {} as ChangePasswordAdminVM;
  adminPhoto : string | undefined = '';
  Message : [string, boolean] = ["",false];
  initialAdmin: any = {};

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.admin = this.authService.getUser();
    this.adminProfile.id = this.admin.id;
    this.adminProfile.nom = this.admin.nom;
    this.adminProfile.prenom = this.admin.prenom;
    this.adminProfile.email = this.admin.email;
    this.adminProfile.tel = this.admin.tel;
    this.adminPhoto = this.admin.photo;
    this.initialAdmin = { ...this.adminProfile };
  }

  logOut(){
    this.authService.logout();
  }
  
  onChangeProfile(form: NgForm) {
    this.authService.changeProfile(this.adminProfile).subscribe(
      response => {
        this.changeMessage('Profile updated successfully',true);
      },
      error => {
        console.log(error);
        this.changeMessage('There was an error updating the profile!',false);
      }
    );
  }


  onChangePassword(form: NgForm) {
    this.authService.changePassword(this.admin.id,this.adminPassword).subscribe(
      response => {
        this.changeMessage('Password updated successfully',true);
      },
      error => {
        this.changeMessage('There was an error updating the Password!',false);
      }
    );
  }

  onCancelChangeProfile(){
    this.adminProfile = { ...this.initialAdmin };
  }



  changeMessage(Msg:string,etat:boolean){
    this.Message[0] = Msg;
    this.Message[1] = etat;
    setTimeout(() => {
      this.Message[0] = '';
    }, 3000);
  }


}
