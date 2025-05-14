import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Skill } from './worker.module';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private apiUrl = 'http://localhost:3000/api';
  private skills: Skill[] = [];
  private skillsUpdated = new Subject<Skill[]>();

  constructor(private http: HttpClient) {}

  getSkills(): void {
    this.http.get<{skills: Skill[]}>(`${this.apiUrl}/skills`)
      .subscribe({
        next: (data) => {
          this.skills = data.skills;
          this.skillsUpdated.next([...this.skills]);
        },
        error: (err) => console.error('Error fetching skills:', err)
      });
  }

  addSkill(skillData: Omit<Skill, 'idskill'>): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}/skills`, skillData).pipe(
      tap({
        next: () => this.getSkills(),
        error: (err) => console.error('Error adding attributes:', err)
      })
    );
  }

  deleteSkill(skillId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/skills/${skillId}`).pipe(
      tap(() => this.getSkills())
    );
  }

  getSkillsUpdateListener(): Observable<Skill[]> {
    return this.skillsUpdated.asObservable();
  }
}