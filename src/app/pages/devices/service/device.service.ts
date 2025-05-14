import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Attribute, Device, DeviceAttributes } from './device.module';
import { AttributeService } from './attribute.service';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private apiUrl = 'http://localhost:3000/api';
  private devices: Device[] = [];
  private devicesUpdated = new Subject<Device[]>();
  private attributes: Attribute[] = [];
  private attributesUpdated = new Subject<Attribute[]>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar , private attributeService : AttributeService) {}

  // Device methods
  getDevices(): void {
    this.http.get<{devices: Device[]}>(`${this.apiUrl}/devices`).subscribe({
      next: (data) => {
        this.devices = data.devices;
        this.devicesUpdated.next([...this.devices]);
      },
      error: (err) => this.showError('Failed to load devices')
    });
  }

  getDeviceAttributes(deviceId: string): Observable<DeviceAttributes[]> {
    return this.http.get<DeviceAttributes[]>(`${this.apiUrl}/devices/${deviceId}/attributes`);
  }

  addDevice(deviceData: any): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}/devices`, deviceData).pipe(
      tap(() => {
        this.getDevices();
        this.showSuccess('Device added successfully');
      })
    );
  }

  updateDevice(id: number, deviceData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/devices/${id}`, deviceData).pipe(
      tap(() => {
        this.getDevices();
        this.showSuccess('Device updated successfully');
      })
    );
  }

  deleteDevice(id: string): Observable<any> {
    this.attributeService.deleteAttributes(id);
    return this.http.delete(`${this.apiUrl}/devices/${id}`).pipe(
      tap(() => {
        this.getDevices();
        this.showSuccess('Device deleted successfully');
      })
    );
  }

  getDeviceUpdateListener(): Observable<Device[]> {
    return this.devicesUpdated.asObservable();
  }

  addDeviceAttributes(deviceId: string, attributeIds: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/devices/${deviceId}/attributes`, { attributeIds });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}