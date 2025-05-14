import {Component, inject ,ChangeDetectionStrategy, input, Input} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatTableModule } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

/**
 * @title Injecting data when opening a dialog
 */
@Component({
  selector: 'dialog-data-example',
  standalone:true,
  template: `
    <button 
      (click)="openDialog()" 
      mat-mini-fab 
      color="primary" 
      [class]="product?.state === 0 ? 'bg-light-error text-error' : 'bg-light-success text-success'"
      class="icon-30 cart-btn " 
      matTooltip="Add to Cart">
      <i-tabler name="power" class="icon-16"></i-tabler>
    </button>
  `,
  imports: [MatButtonModule,MatIconModule,TablerIconsModule,MatTableModule],
})
export class DialogDataExample {
  @Input() product!: any;
  dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(DialogDataExampleDialog, {
      data: this.product,
    });
  }

}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialogueMech.componant.html',
  imports: [MatDialogTitle, MatDialogContent,MatCardModule],
  standalone:true,
})
export class DialogDataExampleDialog {
  data = inject(MAT_DIALOG_DATA);
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
}
