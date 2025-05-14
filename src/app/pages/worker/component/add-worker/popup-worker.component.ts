import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddWorkerComponent } from './add-worker.component';

@Component({
  selector: 'app-popup-worker',
  template: `
    <button mat-raised-button color="primary" 
            matTooltip="Add new worker" (click)="openDialog()">
            <mat-icon class="d-flex align-items-center">
              <i-tabler name="plus" class="icon-18 d-flex"></i-tabler>
            </mat-icon> Add Worker
    </button>
  `
})
export class PopupWorkerComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AddWorkerComponent, {
      width: '800px'
    });
  }
}