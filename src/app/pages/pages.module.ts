import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

import { DialogDataExample } from './dashboard/diologueMech/dialogueMech.componant';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { sensorDataComponent } from './dashboard/sensor-data/sensorData.componant';
import { EchartGaugeComponent } from './dashboard/echart-gauge/echart-gauge.component';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { HistoricComponent } from './historic/historic.component';
import { EchartGraphComponent } from './historic/echart-graph/echart-graph.component';
import { DbGraphComponent } from './historic/db-graph/db-graph.component';
import { HistoricChartComponent } from './historic/db-graph/historic-chart/historic-chart.component';
import { AvailabilityEchartComponent } from './dashboard/availability-echart/availability-echart.component';
import { NotificationComponent } from '../layouts/notification/notification.component';
import { AlertsComponent } from './dashboard/alerts/alerts.component';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesRoutes),
    TablerIconsModule.pick(TablerIcons),
        ReactiveFormsModule,
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
        
  ],
    declarations: [
      EchartGaugeComponent,
      AppDashboardComponent,
      sensorDataComponent,
      HistoricComponent,
      EchartGraphComponent,
      DbGraphComponent,
      HistoricChartComponent,
      AvailabilityEchartComponent ,
      NotificationComponent,
      AlertsComponent,
      
    ],
  exports: [TablerIconsModule],
})
export class PagesModule {}
