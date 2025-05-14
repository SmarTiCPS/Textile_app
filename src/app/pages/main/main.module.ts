import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons

import { MainaRoutes } from './main.routing';
import { DialogDataExample } from 'src/app/layouts/dialogue/dialogue.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HomeComponent } from './component/home/factory.component';
import { AddFactoryComponent } from './component/add-factory/add-factory.component';
import { FactoryCardComponent } from './component/card/factory-card.component';
import { PopupFactoryComponent } from './component/add-factory/popup-factory.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MainaRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DialogDataExample,
    NgApexchartsModule,
    NgxEchartsModule.forRoot({ echarts }),
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
],
  declarations: [
    AddFactoryComponent,
    FactoryCardComponent,
    PopupFactoryComponent,
    HomeComponent 

  ],
})
export class MainModule {}
