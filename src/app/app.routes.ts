import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CardsComponent } from './features/cards/cards.component';
import { LayoutComponent } from './shared/Layouts/DashboardLayout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { Eror404Component } from './features/eror404/eror404.component';
import { ListParckingComponent } from './features/list-parcking/list-parcking.component';
import { AddParkingComponent } from './features/add-parking/add-parking.component';
import { ParkingDetailsComponent } from './features/parking-details/parking-details.component';
import { EditParkingComponent } from './features/edit-parking/edit-parking.component';

export const routes: Routes = [
    {
        path: '',
            component: LayoutComponent
    },
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'cards',
                component: CardsComponent
            }
        ]
    },
    {
        path: 'parkings',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: ListParckingComponent
            },
            {
                path: 'list',
                component: ListParckingComponent
            },
            {
                path: 'add',
                component: AddParkingComponent
            },
            {
                path: 'edit/:id',
                component: EditParkingComponent
            },
            {
                path: 'details/:id',
                component: ParkingDetailsComponent
            }
        ]
    },
    {
        path: 'login',
            component: LoginComponent
    },
    {
        path: '**',
            component: Eror404Component
    }
    
    
];
