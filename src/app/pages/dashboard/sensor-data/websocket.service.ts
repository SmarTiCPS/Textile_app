import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { CustomAlertService } from 'src/app/layouts/full/service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class KafkaService {
  private socket: Socket;
  private readonly apiUrl = 'http://localhost:3000';
  
  // Topic-specific limits configuration
  topicsLimit: { topic: string; unit: string; limit: number; }[] = [
    { topic: "temperature_celsius", unit: '°C', limit: 30 },
    { topic: "humidity", unit: '%', limit: 60 },
    { topic: "air_quality", unit: 'Pbar', limit: 300 },
    { topic: "distance", unit: 'CM', limit: 300 },
    { topic: "camera", unit: 'center camera(frame)', limit: 1 },
  ];

  constructor(private customAlertService: CustomAlertService) {
    this.socket = io(this.apiUrl);
  }

  getMessages(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('kafka-message', (message: any) => {
        try {
          // Parse the message if needed
          let parsedValue = message.value;
          if (message.value && typeof message.value === 'string') {
            parsedValue = JSON.parse(message.value);
          }

          // Check if the value exceeds the limit for this topic
          if(message.topic == 'camera'){
            this.showAlert(message.topic, parsedValue);
          }
          if (parsedValue && this.isValueHigh(message.topic, parsedValue)) {
            this.showAlert(message.topic, parsedValue);
          }

          observer.next(message);
        } catch (error) {
          console.error('Failed to process message:', error);
          observer.error(error);
        }
      });
    });
  }

  private isValueHigh(topic: string, value: any): boolean {
    // Find the topic configuration
    const topicConfig = this.topicsLimit.find(t => t.topic === topic);
    
    // If topic is not configured or value is not a number, return false
    if (!topicConfig || typeof value.data !== 'number') {
      return false;
    }

    // Check if value exceeds the configured limit
    return value.data > topicConfig.limit;
  }

  private showAlert(topic: string, value: any): void {
    // Find the topic configuration
    const topicConfig = this.topicsLimit.find(t => t.topic === topic);
   // console.log(topicConfig);
    
    if (!topicConfig) return;
    const alertData = {
      topic: topic,
      value: value.data,
      unit: topicConfig.unit,
      limit: topicConfig.limit,
      message: `High value alert on ${topic}: ${value.data} ${topicConfig.unit} exceeds limit of ${topicConfig.limit} ${topicConfig.unit}`,
      duration: 5000 // 5 seconds
    };
    if(topic=="camera"){
      alertData.message = `abnormal behavior on ${topic}: ${value.data} detected with ${topicConfig.unit}`;
    }

    
    this.customAlertService.addAlert(alertData);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Optional: Method to update topic limits
  updateTopicLimit(topic: string, newLimit: number): void {
    const topicIndex = this.topicsLimit.findIndex(t => t.topic === topic);
    if (topicIndex >= 0) {
      this.topicsLimit[topicIndex].limit = newLimit;
    }
  }

  // Optional: Method to add new topic configuration
  addTopicConfig(topic: string, unit: string, limit: number): void {
    if (!this.topicsLimit.some(t => t.topic === topic)) {
      this.topicsLimit.push({ topic, unit, limit });
    }
  }
}