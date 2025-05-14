import { Routes } from '@angular/router';


// pages
import { AuthGuard } from '../authentication/auth.guard';
import { DeviceHomeComponent } from './component/deivce-home/device.component';

export const DeviceRoutes: Routes = [
    { 
        path: '',
        children: [
          {
                  path: '',
                  component:DeviceHomeComponent ,
                  
                },
                {
                  path: 'overview/:id',
                  component: DeviceHomeComponent ,
                  
                },
        ]
      }
];
