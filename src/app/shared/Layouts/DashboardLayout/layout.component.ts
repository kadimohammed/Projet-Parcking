import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, SideBarComponent,NavBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
