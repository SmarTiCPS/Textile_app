import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { VideoRoutes } from './video.routing';
import { AppVideoComponent } from './video/video.component';
import { AppPlanComponent } from './plan-view/plan.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VideoRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
  ],
  declarations: [
    AppVideoComponent,
    AppPlanComponent,
  ],
})
export class VideoModule {}
