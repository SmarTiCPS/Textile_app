import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomAlertService } from 'src/app/layouts/full/service/notification.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit, OnDestroy {
  notifications: any[] = []; // Temporary notifications
  alertHistory: any[] = []; // Persistent alerts
  private notificationSub: any;
  private historySub: any;

  constructor(private alertService: CustomAlertService) {}

  ngOnInit(): void {
    // Subscribe to temporary notifications
    this.notificationSub = this.alertService.alerts$.subscribe(alerts => {
      this.notifications = alerts;
    });

    // Subscribe to persistent alert history
    this.historySub = this.alertService.alertHistory$.subscribe(history => {
      this.alertHistory = history;
    });
  }

  getAlertIcon(topic: string): string {
    const icons: {[key: string]: string} = {
      'temperature_celsius': 'temperature-plus',
      'humidity': 'droplet',
      'air_quality': 'michelin-star',
      'distance': 'ruler-measure',
      'camera' : 'video-minus',
    };
    return icons[topic] || 'worker-icon';
  }

  getAlertColor(topic: string): string {
    const colors: {[key: string]: string} = {
      'temperature_celsius': '#FF6B6B',
      'humidity': '#4ECDC4',
      'air_quality': '#4ECDC4',
      'distance': '#FFA500',
      'camera': '#FF6B6B'
    };
    return colors[topic] || '#FF6B6B';
  }


  ngOnDestroy(): void {
    this.notificationSub.unsubscribe();
    this.historySub.unsubscribe();
  }
}