import { Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard.component';
import { AuthGuard } from '../authentication/auth.guard';




export const dashboardRoutes: Routes = [
  {
    path: '',
    component:AppDashboardComponent,
    
  },
];
