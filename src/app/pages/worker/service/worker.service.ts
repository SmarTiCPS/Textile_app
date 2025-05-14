import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Worker, WorkerSkills, Skill } from './worker.module';
import { SkillService } from './skills.service';

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private apiUrl = 'http://localhost:3000/api';
  private workers: Worker[] = [];
  private workersUpdated = new Subject<Worker[]>();

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar, 
    private skillService: SkillService
  ) {}

  getWorkers(): void {
    this.http.get<{workers: Worker[]}>(`${this.apiUrl}/workers`).subscribe({
      next: (data) => {
        this.workers = data.workers;
        this.workersUpdated.next([...this.workers]);
      },
      error: (err) => this.showError('Failed to load workers')
    });
  }

  getWorkerSkills(workerId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/workers/${workerId}/skills`);
  }

  addWorker(workerData: any): Observable<any> {
    return this.http.post<Worker>(`${this.apiUrl}/workers`, workerData).pipe(
      tap(() => {
        this.getWorkers();
        this.showSuccess('Worker added successfully');
      })
    );
  }

  updateWorker(id: string, workerData: Partial<Worker>): Observable<Worker> {
    return this.http.put<Worker>(`${this.apiUrl}/workers/${id}`, workerData).pipe(
      tap(() => {
        this.getWorkers();
        this.showSuccess('Worker updated successfully');
      })
    );
  }

  deleteWorker(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/workers/${id}`).pipe(
      tap(() => {
        this.getWorkers();
        this.showSuccess('Worker deleted successfully');
      })
    );
  }

  getWorkerUpdateListener(): Observable<Worker[]> {
    return this.workersUpdated.asObservable();
  }

  addWorkerSkills(workerId: string, skillIds: string[]): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/workers/${workerId}/skills`, 
      { skillIds }
    );
  }
  updateWorkerSkills(workerId: string, skillIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/workers/${workerId}/skills`;
    return this.http.put(url, { skill_ids: skillIds });
  }
  
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 3000, 
      panelClass: ['success-snackbar'] 
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 5000, 
      panelClass: ['error-snackbar'] 
    });
  }
}