import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Factory } from './factory.module';

@Injectable({ providedIn: 'root' })
export class FactoryService {
  private apiUrl = 'http://localhost:3000/api';
  private factories: Factory[] = [];
  private factoriesUpdated = new Subject<Factory[]>();

  constructor(private http: HttpClient) {}

  getFactories() {
    this.http.get<{factories: Factory[]}>(`${this.apiUrl}/factories`)
      .subscribe({
        next: (data) => {
          this.factories = data.factories;
          this.factoriesUpdated.next([...this.factories]);
        },
        error: (err) => console.error('Error fetching factories:', err)
      });
  }

  uploadFile(file: FormData, type: 'photo' | 'model'): Observable<{ path: string }> {
    const endpoint = type === 'photo' ? 'upload/photo' : 'upload/model';
    return this.http.post<{ path: string }>(`${this.apiUrl}/factories/${endpoint}`, file);
  }
  
  addFactory(factoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/factories`, factoryData).pipe(
      tap({
        next: () => this.getFactories(),
        error: (err) => console.error('Error adding factory:', err)
      })
    );
  }

  deleteFactory(factoryId: string) {
    this.http.delete(`${this.apiUrl}/factories/${factoryId}`)
      .subscribe({
        next: () => this.getFactories(),
        error: (err) => console.error('Error deleting factory:', err)
      });
  }

  getFactoryUpdateListener() {
    return this.factoriesUpdated.asObservable();
  }
}