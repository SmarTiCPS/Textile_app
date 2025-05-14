import { Routes } from '@angular/router';
import { AuthGuard } from '../authentication/auth.guard';
import { WorkerHomeComponent } from './component/worker-home/worker.component';

export const WorkerRoutes: Routes = [
  { 
    path: '',
    children: [
      {
        path: '',
        component: WorkerHomeComponent,
      }
    ]
  }
];