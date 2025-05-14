import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { DeviceService } from '../../service/device.service';
import { Attribute } from '../../service/device.module';
import { Factory } from 'src/app/pages/main/services/factory.module';
import { AddAttributeDialogComponent } from '../add-attribute/popup-attribute.component';
import { FactoryService } from 'src/app/pages/main/services/factory.service';
import { AttributeService } from '../../service/attribute.service';





@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {
  deviceForm: FormGroup;
  isLoading = false;
  attributes: Attribute[] = [];
  factories: Factory[] = [];
  private factoriesSub!: Subscription;
  private attributesSub!: Subscription;

  selectedAttributes: string[] = []; // Store only attribute IDs

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<AddDeviceComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog ,
    public factoryService: FactoryService ,
    private attributeService: AttributeService,
    
  ) {
    this.deviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      type: ['', Validators.required],
      factory_id: ['', Validators.required],
      attributes: [[]]
    });
    this.loadAttributes();
    this.attributesSub = this.attributeService.getAttributesUpdateListener()
      .subscribe({
        next: (attributes) => {
          this.attributes = attributes;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error receiving attributes updates:', err);
          this.isLoading = false;
        }
      });

      this.loadFactories();
      this.factoriesSub = this.factoryService.getFactoryUpdateListener()
        .subscribe({
          next: (factories) => {
            this.factories = factories;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error receiving factory updates:', err);
            this.isLoading = false;
          }
        });
  }
  loadAttributes() {
    this.isLoading = true;
    this.attributeService.getAttributes();
  }
  loadFactories() {
    this.isLoading = true;
    this.factoryService.getFactories();
  }

  openAddAttributeDialog(): void {
    const dialogRef = this.dialog.open(AddAttributeDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAttributes(); // Refresh the attributes list
      }
    });
  }

  onAttributeSelectionChange(attributeId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedAttributes.push(attributeId);
    } else {
      this.selectedAttributes = this.selectedAttributes.filter(id => id !== attributeId);
    }
  }

  async onSubmit() {
    if (this.deviceForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      // First create the device
      const deviceData = {
        name: this.deviceForm.value.name,
        location: this.deviceForm.value.location,
        type: this.deviceForm.value.type,
        factory_id: this.deviceForm.value.factory_id
      };

      const deviceResponse: any = await lastValueFrom(this.deviceService.addDevice(deviceData));
      const deviceId = deviceResponse.device.id;
console.log(deviceResponse.device)
      // Then add device-attribute relationships
      if (this.selectedAttributes.length > 0) {
        await lastValueFrom(this.deviceService.addDeviceAttributes(
          deviceId,
          this.selectedAttributes
        ));
      }

      this.snackBar.open('Device added successfully!', 'Close', {
        duration: 3000
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open('Error creating device: ' + (error as Error).message, 'Close', {
        duration: 5000
      });
    } finally {
      this.isLoading = false;
    }
  }
}