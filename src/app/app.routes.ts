import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CardsComponent } from './features/cards/cards.component';
import { LayoutComponent } from './shared/Layouts/DashboardLayout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { Eror404Component } from './features/eror404/eror404.component';

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
