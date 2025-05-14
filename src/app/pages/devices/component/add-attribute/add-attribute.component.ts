import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, lastValueFrom } from 'rxjs';
import { AttributeService } from '../../service/attribute.service';





@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.css']
})
export class AddAttributeComponent {
  attributeForm: FormGroup;
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private attributeService: AttributeService,
    public dialogRef: MatDialogRef<AddAttributeComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.attributeForm = this.fb.group({
      attribute: ['', [Validators.required, Validators.minLength(3)]],
      unit: ['', Validators.required],

    });

  }
  async onSubmit() {
    if (this.attributeForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      // First create the device
      const attributeData = {
        attribute: this.attributeForm.value.attribute,
        unit: this.attributeForm.value.unit,
      };
      const AttributeResponse: any = await lastValueFrom(this.attributeService.addAttribute(attributeData));

      this.snackBar.open('attribute added successfully!', 'Close', {
        duration: 3000
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open('Error creating attribute: ' + (error as Error).message, 'Close', {
        duration: 5000
      });
    } finally {
      this.isLoading = false;
    }
  }
}