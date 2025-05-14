import { Routes } from '@angular/router';


// pages
import { AppIconsComponent } from './icons/icons.component';
import { AppSamplePageComponent } from './sample-page/sample-page.component';
import { AuthGuard } from '../authentication/auth.guard';

export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'icons',
        component: AppIconsComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'sample-page',
        component: AppSamplePageComponent,
        canActivate:[AuthGuard]
      },
    ],
  },
];
