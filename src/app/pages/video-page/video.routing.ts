import { Routes } from '@angular/router';


// pages

import { AppVideoComponent } from './video/video.component';
import { AppPlanComponent } from './plan-view/plan.component';
import { AuthGuard } from '../authentication/auth.guard';

export const VideoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'video',
        component: AppVideoComponent,
        
      },
      {
        path: 'plan',
        component: AppPlanComponent,
       
      }
    ],
  },
];
