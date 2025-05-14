import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';


import { DialogDataExample } from 'src/app/layouts/dialogue/dialogue.component';

import { NgApexchartsModule } from 'ng-apexcharts';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { dashboardRoutes } from './dashboard.routing';
import { EchartGaugeComponent } from './echart-gauge/echart-gauge.component';
import { AppDashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {  sensorDataComponent } from './sensor-data/sensorData.componant';
import { MatNativeDateModule } from '@angular/material/core';
import { AvailabilityEchartComponent } from './availability-echart/availability-echart.component';
import { AlertsComponent } from './alerts/alerts.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    DialogDataExample,
    NgApexchartsModule,
    NgxEchartsModule.forRoot({ echarts }),
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    MatNativeDateModule,
    sensorDataComponent,
    AvailabilityEchartComponent,

],
  declarations: [
    EchartGaugeComponent,
    AppDashboardComponent,
    sensorDataComponent,
  ],
})
export class DashboardModule {}
