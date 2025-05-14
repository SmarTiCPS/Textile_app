import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';



import { DialogDataExample } from 'src/app/layouts/dialogue/dialogue.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeviceRoutes } from './device.routing';
import { DeviceCardComponent } from './component/device-card/device-card.component';
import { DeviceHomeComponent } from './component/deivce-home/device.component';
import { AddDeviceComponent } from './component/add-device/add-device.component';
import { PopupDeviceComponent } from './component/add-device/popup-device.component';
import { AddAttributeComponent } from './component/add-attribute/add-attribute.component';
import { AddAttributeDialogComponent } from './component/add-attribute/popup-attribute.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DeviceRoutes),
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
    AddDeviceComponent,
    DeviceCardComponent,
    PopupDeviceComponent,
    DeviceHomeComponent ,
    AddAttributeComponent,
    AddAttributeDialogComponent
  ],
})
export class DeviceModule {}
