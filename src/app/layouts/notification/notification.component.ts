import { Component, OnDestroy } from '@angular/core';
import { CustomAlertService } from '../full/service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnDestroy {
  alerts: any[] = [];
  private subscription: any;

  constructor(private alertService: CustomAlertService) {
    this.subscription = this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  dismiss(id: number): void {
    this.alertService.removeAlert(id);
  }

  getAlertClass(alert: any): string {
    return 'alert-' + alert.topic.replace('_', '-');
  }

  getProgress(alert: any): number {
    if (!alert.timer) return 100;
    return (alert.duration / 5000) * 100; // Simplified progress calculation
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}