import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { WorkerRoutes } from './worker.routing';
import { WorkerHomeComponent } from './component/worker-home/worker.component';
import { AddWorkerComponent } from './component/add-worker/add-worker.component';
import { PopupWorkerComponent } from './component/add-worker/popup-worker.component';
import { AddSkillComponent } from './component/add-skill/add-skill.component';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(WorkerRoutes),
    FormsModule,
    ReactiveFormsModule,
    
    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule,
    MaterialModule ,
    TablerIconsModule.pick(TablerIcons),
    
  ],
  declarations: [
    AddWorkerComponent,
    PopupWorkerComponent,
    WorkerHomeComponent,
    AddSkillComponent,
    
  ],
})
export class WorkerModule {}