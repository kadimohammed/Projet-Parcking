import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Login } from '../../core/ViewModels/Login.model';
import { AuthService } from '../../core/services/adminauth.service';

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
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      this.authService.loginuser(this.user).subscribe({
        next: (response) => {
          this.authService.setUser(response);
          this.router.navigate(['/parkings']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }
}
