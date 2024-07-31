import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Login } from '../../core/ViewModels/Login.model';
import { AuthService } from '../../core/services/AuthService.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  user: Login = {} as Login;
  errorMessage = '';

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  onSubmit(myForm: NgForm) {
    this.loadingService.show();
    if (myForm.valid) {
      this.authService.loginuser(this.user).subscribe({
        next: (response) => {
          this.authService.setUser(response);
          this.router.navigate(['/parkings']);
          this.loadingService.hide();
        },
        error: (error) => {
          this.errorMessage = this.authService.errorMessage ;
          this.loadingService.hide();
        }
      });
    } else {
      this.errorMessage = 'Email or Password Incorrect';
    }
  }
}
