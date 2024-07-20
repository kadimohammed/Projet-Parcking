import { Component, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,NgIf,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  Login(loginForm: NgForm):void{
    console.log(loginForm);
  }
}
