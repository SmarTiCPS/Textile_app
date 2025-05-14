import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  id: number;
  date: string;
  time: string;
  color: string;
  topic: string;
  value: number;
  message: string;
  duration: number;
  link?: string;
  timer?: any;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {
  private alerts: Alert[] = [];
  private alertHistory: Alert[] = [];
  private alertId = 0;
  public alerts$ = new Subject<Alert[]>();
  public alertHistory$ = new Subject<Alert[]>();
  
  // Track currently displayed alerts by topic
  private activeAlerts = new Map<string, Alert>();

  constructor() {}

  addAlert(alertData: { 
    topic: string; 
    value: number; 
    message: string; 
    duration: number 
  }): void {
    const now = new Date();
    
    // Check if there's an existing alert for this topic
    const existingAlert = this.activeAlerts.get(alertData.topic);
    
    if (existingAlert) {
      // Update the existing alert instead of creating a new one
      existingAlert.value = alertData.value;
      existingAlert.message = alertData.message;
      existingAlert.date = now.toLocaleDateString();
      existingAlert.time = now.toLocaleTimeString();
      
      // Reset the timer
      clearTimeout(existingAlert.timer);
      existingAlert.timer = setTimeout(() => {
        this.removeAlert(existingAlert.id);
      }, alertData.duration);
      
      // Notify subscribers
      this.alerts$.next([...this.alerts]);
      return;
    }

    // Create new alert if none exists for this topic
    const newAlert: Alert = {
      id: ++this.alertId,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      color: this.getAlertColor(alertData.topic),
      topic: alertData.topic,
      value: alertData.value,
      message: alertData.message,
      duration: alertData.duration,
      link: '#',
      persistent: false
    };

    // Set timer to auto-remove
    newAlert.timer = setTimeout(() => {
      this.removeAlert(newAlert.id);
    }, newAlert.duration);

    // Track active alert
    this.activeAlerts.set(alertData.topic, newAlert);
    
    // Add to notifications
    this.alerts.unshift(newAlert);
    this.alerts$.next([...this.alerts]);

    // Add to history
    const persistentAlert = {...newAlert, persistent: true};
    this.alertHistory.unshift(persistentAlert);
    this.alertHistory$.next([...this.alertHistory]);
  }

  private getAlertColor(topic: string): string {
    const colorMap: {[key: string]: string} = {
      'temperature_celsius': 'danger',
      'humidity': 'warn',
      'air_quality': 'danger',
      'distance': 'warn' ,
      'camera':'danger',
    };
    return colorMap[topic] || 'danger';
  }

  removeAlert(id: number): void {
    const alertIndex = this.alerts.findIndex(a => a.id === id);
    if (alertIndex >= 0) {
      const alert = this.alerts[alertIndex];
      
      // Remove from active alerts map
      this.activeAlerts.delete(alert.topic);
      
      // Clear timer and remove from array
      clearTimeout(alert.timer);
      this.alerts.splice(alertIndex, 1);
      this.alerts$.next([...this.alerts]);
    }
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getAlertHistory(): Alert[] {
    return [...this.alertHistory];
  }

  clearHistory(): void {
    this.alertHistory = [];
    this.alertHistory$.next([]);
  }
}