import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardsComponent } from './cards/cards.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { Eror404Component } from './eror404/eror404.component';

export const routes: Routes = [
    {
        path: '',
            component: LoginComponent
    },
    {
        path: 'Home',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'Dashboard',
                component: DashboardComponent
            },
            {
                path: 'Cards',
                component: CardsComponent
            },
        ]
    },
    {
        path: 'Login',
            component: LoginComponent
    },
    {
        path: '**',
            component: Eror404Component
    }
    
    
];
