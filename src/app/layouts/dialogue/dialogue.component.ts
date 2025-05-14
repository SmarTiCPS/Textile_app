import {Component, Inject, Input} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule ,NgForm,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';

export interface DialogData {
    id: number;
    imgSrc: string;
    title: string;
    adress : string;
  }
/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'app-popup',
  templateUrl: 'dialogue.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class DialogDataExample {
  @Input() data:any;
  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DialogDataExampleDialog, {
      data: this.data,
    });
    console.log(this.data);
  }
}

@Component({
  selector: 'app-popup-data',
  templateUrl: 'dialogue-data.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent,FormsModule, MatFormFieldModule, MatInputModule,ReactiveFormsModule,MatCard,CommonModule],
})
export class DialogDataExampleDialog {

}


/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */