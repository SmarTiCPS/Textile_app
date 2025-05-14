import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA , MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { AddAttributeComponent } from './add-attribute.component';

@Component({
  selector: 'app-popup-attribute',
  template: `
    <button mat-mini-fab color="primary" class="icon-30" 
            matTooltip="Add new attribute" (click)="openDialog()">
      +
    </button>
  `
})
export class AddAttributeDialogComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AddAttributeComponent);
  }
}