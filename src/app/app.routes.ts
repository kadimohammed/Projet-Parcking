import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CardsComponent } from './features/cards/cards.component';
import { LayoutComponent } from './shared/Layouts/DashboardLayout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { Eror404Component } from './features/eror404/eror404.component';
import { ListParckingComponent } from './features/list-parcking/list-parcking.component';
import { AddParkingComponent } from './features/add-parking/add-parking.component';
import { ParkingDetailsComponent } from './features/details-parking/details-parking.component';
import { EditParkingComponent } from './features/edit-parking/edit-parking.component';
import { authGuard } from './core/guards/auth.guard';
import { ListArtisanComponent } from './features/list-artisan/list-artisan.component';
import { AddArtisanComponent } from './features/add-artisan/add-artisan.component';
import { EditArtisanComponent } from './features/edit-artisan/update-artisan.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ParkingsMapsComponent } from './features/parkings-maps/parkings-maps.component';
import { ListTypeArtisanComponent } from './features/list-type-artisan/list-type-artisan.component';
import { AddTypeArtisanComponent } from './features/add-type-artisan/add-type-artisan.component';
import { UpdateTypeArtisanComponent } from './features/edit-type-artisan/edit-type-artisan.component';
import { ParkingTopViewComponent } from './Khaireddine/parking-top-view/parking-top-view.component';
import { CameraViewComponent } from './features/camera-view/camera-view.component';
import { AlertMessageComponent } from './features/alert-message/alert-message.component';
import { DetailsArtisanComponent } from './features/details-Artisan/details-Artisan.component';

export const routes: Routes = [
    {
        path: '',
            component: LayoutComponent,canActivate: [authGuard],
    },
    {
        path: 'home',
        component: LayoutComponent,canActivate: [authGuard],
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
                path: 'TendencyNews',
                component: CardsComponent
            }
        ]
    },
    {
        path: 'parkings',
        component: LayoutComponent,canActivate: [authGuard],
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
        path: 'Artisans',
        component: LayoutComponent,canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ListArtisanComponent
            },
            {
                path: 'list',
                component: ListArtisanComponent
            },
            {
                path: 'add',
                component: AddArtisanComponent
            },
            {
                path: 'edit/:id',
                component: EditArtisanComponent
            },
            {
                path: 'details/:id',
                component: DetailsArtisanComponent
            }
        ]
    },
    {
        path: 'typesArtisan',
        component: LayoutComponent,canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ListTypeArtisanComponent
            },
            {
                path: 'list',
                component: ListTypeArtisanComponent
            },
            {
                path: 'add',
                component: AddTypeArtisanComponent
            },
            {
                path: 'edit/:id',
                component: UpdateTypeArtisanComponent
            },
        ]
    },
    {
        path: 'topview',
        component: LayoutComponent,canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ParkingTopViewComponent
            },
            {
                path: ':id',
                component: ParkingTopViewComponent
            }
        ]
    },
    {
        path: 'cameraview',
        component: LayoutComponent,canActivate: [authGuard],
        children: [
            {
                path: '',
                component: CameraViewComponent
            },
            {
                path: ':id',
                component: CameraViewComponent
            }
            
        ]
    },
    {
        path: 'profile',
        component: LayoutComponent,canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ProfileComponent
            }
        ]
    },
    {
        path: 'parkingsmap',
        component: LayoutComponent,canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ParkingsMapsComponent
            },
            {
                path: ':id',
                component: ParkingsMapsComponent
            }
        ]
    },
    {
        path: 'login',
            component: LoginComponent
    },
    {
        path: 'alert',
            component: AlertMessageComponent
    },
    {
        path: '**',
            component: Eror404Component
    }
];
