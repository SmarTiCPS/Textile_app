import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Device } from '../../service/device.module';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
})
export class DeviceCardComponent {
  @Input() device!: Device;
  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.device.id);
  }
}