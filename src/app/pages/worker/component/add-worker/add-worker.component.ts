import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, lastValueFrom } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

import { Worker } from '../../service/worker.module';
import { WorkerService } from '../../service/worker.service';
import { Skill } from '../../service/worker.module';
import { SkillService } from '../../service/skills.service';
import { AddSkillComponent } from '../add-skill/add-skill.component';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.css']
})
export class AddWorkerComponent implements OnInit, OnDestroy {
  workerForm: FormGroup;
  isLoading = false;
  skills: Skill[] = [];
  isEditMode = false;
  skillSelection = new SelectionModel<string>(true, []);
  private skillsSub!: Subscription;
  selectedSkills: string[] = []; // Store only attribute IDs

  constructor(
    private fb: FormBuilder,
    private workerService: WorkerService,
    private skillService: SkillService,
    public dialogRef: MatDialogRef<AddWorkerComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { worker: Worker }
  ) {
    this.workerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      second_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      address: [''],
      birthday: [null]
    });

    if (data?.worker) {
      this.isEditMode = true;
      const initialSkills = data.worker.skills?.map(skill => skill.idskill) || [];
      this.skillSelection = new SelectionModel<string>(true, initialSkills);
      this.workerForm.patchValue({
        first_name: data.worker.first_name,
        second_name: data.worker.second_name,
        email: data.worker.email,
        phone_number: data.worker.phone_number,
        address: data.worker.address,
        birthday: data.worker.birthday
      });
    }
  }

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills() {
    this.isLoading = true;
    this.skillService.getSkills();
    this.skillsSub = this.skillService.getSkillsUpdateListener()
      .subscribe({
        next: (skills) => {
          this.skills = skills;
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Error receiving skills updates:', err);
          this.isLoading = false;
        }
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddSkillComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadSkills();
      }
    });
  }

 /*  onSkillSelectionChange(skillId: string, isChecked: boolean): void {
    if (isChecked) {
      this.skillSelection.select(skillId);
    } else {
      this.skillSelection.deselect(skillId);
    }
  } */
  onSkillSelectionChange(skillId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedSkills.push(skillId);
    } else {
      this.selectedSkills = this.selectedSkills.filter(id => id !== skillId);
    }
    console.log(this.selectedSkills)

  }

  async onSubmit(): Promise<void> {
    if (this.workerForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const formValue = this.workerForm.value;

    try {
      const workerData = {
        ...formValue,
        skills: this.skillSelection.selected
      };

      if (this.isEditMode) {
        // Update existing worker
        await lastValueFrom(this.workerService.updateWorker(
          this.data.worker.id,
          workerData
        ));
        
        // Update skills separately if needed
        if (this.skillSelection.selected.length > 0) {
          await lastValueFrom(this.workerService.updateWorkerSkills(
            this.data.worker.id,
            this.skillSelection.selected
          ));
        }
      } else {
        // Create new worker
        const response = await lastValueFrom(this.workerService.addWorker(workerData));
        const workerId = response.worker.id;
        console.log(this.selectedSkills)
        
        // Add skills if any are selected
        if (this.selectedSkills.length > 0) {
          await lastValueFrom(this.workerService.addWorkerSkills(
            workerId,
            this.selectedSkills
          ));
        }
      }

      this.snackBar.open(`Worker ${this.isEditMode ? 'updated' : 'added'} successfully!`, 'Close', {
        duration: 3000
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open(
        `Error ${this.isEditMode ? 'updating' : 'creating'} worker: ${(error as Error).message}`,
        'Close',
        { duration: 5000 }
      );
    } finally {
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.skillsSub?.unsubscribe();
  }
}