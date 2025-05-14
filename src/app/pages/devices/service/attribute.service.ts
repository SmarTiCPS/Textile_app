import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Attribute } from './device.module';

@Injectable({ providedIn: 'root' })
export class AttributeService {
  private apiUrl = 'http://localhost:3000/api';
  private attributes: Attribute[] = [];
  private attributesUpdated = new Subject<Attribute[]>();

  constructor(private http: HttpClient) {}

  getAttributes() {
    this.http.get<{attributes: Attribute[]}>(`${this.apiUrl}/attributes`)
      .subscribe({
        next: (data) => {
          this.attributes = data.attributes;
          this.attributesUpdated.next([...this.attributes]);
        },
        error: (err) => console.error('Error fetching attributes:', err)
      });
  }

  addAttribute(attributeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attributes`, attributeData).pipe(
      tap({
        next: () => this.getAttributes(),
        error: (err) => console.error('Error adding attributes:', err)
      })
    );
  }

  deleteAttributes(attributeId: string) {
    this.http.delete(`${this.apiUrl}/attributes/${attributeId}`)
      .subscribe({
        next: () => this.getAttributes(),
        error: (err) => console.error('Error deleting attributes:', err)
      });
  }

  getAttributesUpdateListener() {
    return this.attributesUpdated.asObservable();
  }
}