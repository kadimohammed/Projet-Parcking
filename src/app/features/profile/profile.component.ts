import { Component, OnInit, ViewChild } from '@angular/core';
import { Admin } from '../../core/models/admin.model';
import { AuthService } from '../../core/services/AuthService.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ChangeProfileAdminVM } from '../../core/ViewModels/ChangeProfileAdminVM';
import { ChangePasswordAdminVM } from '../../core/ViewModels/ChangePasswordAdminVM';
import { AlertMessageComponent } from '../alert-message/alert-message.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,AlertMessageComponent,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  admin : Admin = {} as Admin;
  adminProfile: ChangeProfileAdminVM = {} as ChangeProfileAdminVM;
  adminPassword: ChangePasswordAdminVM = {} as ChangePasswordAdminVM;
  adminPhoto : string | undefined = '';
  initialAdmin: any = {};


  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;

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
        this.message.changeMessage('Profile updated successfully',true);
      },
      error => {
        console.log(error);
        this.message.changeMessage('There was an error updating the profile!',false);
      }
    );
  }



  onChangePassword(form: NgForm) {
    console.log(form.value);
    if (form.value.NewPassword !== form.value.ConfirmNewPassword) {
      form.controls['ConfirmNewPassword'].setErrors({ passwordMismatch: true });
    } 
    else {
      this.authService.changePassword(this.admin.id,this.adminPassword).subscribe(
        response => {
          this.message.changeMessage('Password updated successfully',true);
          this.authService.logout();
        },
        error => {
          if(this.authService.errorMessage === "400"){
            form.controls['OldPassword'].setErrors({ oldPasswordIncorect: true });
          }
          else{
            this.message.changeMessage(this.authService.errorMessage,false);
          }
          
        }
      );
    }
  }

  onCancelChangeProfile(){
    this.adminProfile = { ...this.initialAdmin };
  }

}
