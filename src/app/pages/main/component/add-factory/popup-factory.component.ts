import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFactoryComponent } from './add-factory.component';
import { MAT_DIALOG_DATA , MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-factory',
  template: `
    <button mat-mini-fab color="primary" class="icon-30" 
            matTooltip="Add new factory" (click)="openDialog()">
      +
    </button>
  `
})
export class PopupFactoryComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AddFactoryComponent);
  }
}