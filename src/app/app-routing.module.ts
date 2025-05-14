import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './pages/authentication/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',

      },{
        path: 'main',
        loadChildren: () =>
          import('./pages/main/main.module').then((m) => m.MainModule),
        
      },
      {
        path: 'devices',
        loadChildren: () =>
          import('./pages/devices/device.module').then((m) => m.DeviceModule),
        
      },
      {
        path: 'workers',
        loadChildren: () =>
          import('./pages/worker/worker.module').then((m) => m.WorkerModule),
        
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
        
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
          
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
        
      },
      {
        path: 'video-page',
        loadChildren: () =>
          import('./pages/video-page/video.module').then((m) => m.VideoModule),
        
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
