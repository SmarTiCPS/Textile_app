import { Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { AppOverviewComponent } from './overview/overview.component';
import { AuthGuard } from './authentication/auth.guard';
import { HistoricComponent } from './historic/historic.component';
import { WorkerHomeComponent } from './worker/component/worker-home/worker.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: AppDashboardComponent,
      
      },
      {
        path: 'overview',
        component: AppOverviewComponent,
        
      },
      {
        path: 'historic',
        component:HistoricComponent ,
        
      },
      {
        path: 'workers',
        component:WorkerHomeComponent ,
        
      },
    
    ]
  }

];
