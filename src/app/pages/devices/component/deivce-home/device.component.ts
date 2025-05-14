import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Device } from '../../service/device.module';
import { DeviceService } from '../../service/device.service';


@Component({
  selector: 'app-home',
  templateUrl: './device.component.html',
})
export class DeviceHomeComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  isLoading = true;
  private devicesSub!: Subscription;

  constructor(public deviceService: DeviceService) {}

  ngOnInit() {
    this.loadDevices();
    this.devicesSub = this.deviceService.getDeviceUpdateListener()
      .subscribe({
        next: (devices) => {
          this.devices = devices;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error receiving devices updates:', err);
          this.isLoading = false;
        }
      });
  }

  loadDevices() {
    this.isLoading = true;
    this.deviceService.getDevices();
  }

  isDeleting = false;

  onDelete(deviceId: string) {
    if (confirm('Are you sure you want to delete this device?')) {
      this.isDeleting = true;
      this.deviceService.deleteDevice(deviceId).subscribe({
        next: () => this.isDeleting = false,
        error: () => this.isDeleting = false
      });
    }
  }

  ngOnDestroy() {
    this.devicesSub.unsubscribe();
  }
}