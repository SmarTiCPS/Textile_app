import { Routes } from '@angular/router';


// pages
import { AuthGuard } from '../authentication/auth.guard';
import { HomeComponent } from './component/home/factory.component';

export const MainaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component:HomeComponent ,
        
      },
      {
        path: 'overview/:id',
        component: HomeComponent ,
        
      },
    ],
  },
];
