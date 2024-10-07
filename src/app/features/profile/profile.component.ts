import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Admin } from '../../core/models/admin.model';
import { AuthService } from '../../core/services/AuthService.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ChangeProfileAdminVM } from '../../core/ViewModels/ChangeProfileAdminVM';
import { ChangePasswordAdminVM } from '../../core/ViewModels/ChangePasswordAdminVM';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { LoadingService } from '../../core/services/loading.service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from '../../core/services/Profile.service';

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
  adminCover : string | undefined = '';
  initialAdmin: any = {};

  @ViewChild(AlertMessageComponent) message!: AlertMessageComponent;

  constructor(
    private authService:AuthService,
    private loadingService : LoadingService,
    private titleService: Title,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('LYPARK | PROFILE');
    this.admin = this.authService.getUser();
    this.adminProfile.id = this.admin.id;
    this.adminProfile.nom = this.admin.nom;
    this.adminProfile.prenom = this.admin.prenom;
    this.adminProfile.email = this.admin.email;
    this.adminProfile.tel = this.admin.tel;
    this.adminPhoto = this.admin.photo;
    this.adminCover = this.admin.coverPhoto;
    this.initialAdmin = { ...this.adminProfile };
  }

  logOut(){
    this.authService.logout();
  }
  
  onChangeProfile(form: NgForm) {
    this.loadingService.show();
    this.authService.changeProfile(this.adminProfile).subscribe(
      response => {
        this.loadingService.hide();
        this.message.changeMessage('Profile updated successfully',true);
      },
      error => {
        this.loadingService.hide();
        this.message.changeMessage('There was an error updating the profile!',false);
      }
    );
  }



  onChangePassword(form: NgForm) {
    this.loadingService.show();
    console.log(form.value);
    if (form.value.NewPassword !== form.value.ConfirmNewPassword) {
      form.controls['ConfirmNewPassword'].setErrors({ passwordMismatch: true });
    } 
    else {
      this.authService.changePassword(this.admin.id,this.adminPassword).subscribe(
        response => {
          this.loadingService.hide();
          this.message.changeMessage('Password updated successfully',true);
          //this.authService.logout();
        },
        error => {
          if(this.authService.errorMessage === "400"){
            form.controls['OldPassword'].setErrors({ oldPasswordIncorect: true });
          }
          else{
            this.message.changeMessage(this.authService.errorMessage,false);
          }
          this.loadingService.hide();
          
        }
      );
    }
  }

  onCancelChangeProfile(){
    this.adminProfile = { ...this.initialAdmin };
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loadingService.show(); 
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.loadingService.hide();
          const photoUrl = reader.result as string;
          this.adminPhoto = reader.result as string;
          this.admin.photo = reader.result as string;
          this.profileService.updateAdmin(this.admin);
          this.message.changeMessage('Profile Image updated successfully', true);
        }, 1800);
      };
      reader.readAsDataURL(file);
    }
  }


  onFileChangeCover(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loadingService.show(); // Affiche l'indicateur de chargement
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.adminCover = reader.result as string; // Met à jour le background de la div
          this.loadingService.hide(); // Masque l'indicateur de chargement
          this.message.changeMessage('Profile Cover updated successfully', true); // Affiche le message de succès
        }, 2000); // Délai de 2 secondes
      };
      reader.readAsDataURL(file); // Lit le fichier comme URL
    }
  }
  
  
  
  
}
