import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA , MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { AddDeviceComponent } from './add-device.component';

@Component({
  selector: 'app-popup-device',
  template: `
    <button mat-mini-fab color="primary" class="icon-30" 
            matTooltip="Add new device" (click)="openDialog()">
      +
    </button>
  `
})
export class PopupDeviceComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AddDeviceComponent);
  }
}