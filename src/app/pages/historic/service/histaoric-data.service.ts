import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class HistaoricDataService {
  constructor(private http: HttpClient) {}

  // Fetch historical sensor data
  getData(startDate: Date, endDate: Date, idAttribute: string): Observable<any[]> {
    return this.http
      .get<{ message: string; sensorData: any }>(
        `http://localhost:3000/api/devices/historicdevicedata/${startDate}/${endDate}/${idAttribute}`
      )
      .pipe(
        map((response) => {
          return response.sensorData.map((sensor: any) => ({
            name :sensor.name,
            location :sensor.location,
            timestamp :sensor.timestamp,
            data:sensor.value,
          }));
        })
      );
  }

  // Fetch event types
  getAttributes(): Observable<any[]> {
    return this.http
      .get<{ message: string; eventType: any }>("http://localhost:3000/api/eventtype")
      .pipe(
        map((response) => {
          return response.eventType.map((type: any) => ({
            idtypeevent: type.idtypeevent,
            typeevent: type.typeevent,
          }));
        })
      );
  }

}