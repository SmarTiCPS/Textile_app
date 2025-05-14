import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { SkillService } from '../../service/skills.service';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css']
})
export class AddSkillComponent {
  skillForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    public dialogRef: MatDialogRef<AddSkillComponent>,
    private snackBar: MatSnackBar
  ) {
    this.skillForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  async onSubmit() {
    if (this.skillForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      const skillData = {
        type: this.skillForm.value.type,
        description: this.skillForm.value.description
      };

      await lastValueFrom(this.skillService.addSkill(skillData));

      this.snackBar.open('Skill added successfully!', 'Close', {
        duration: 3000
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open('Error creating skill: ' + (error as Error).message, 'Close', {
        duration: 5000
      });
    } finally {
      this.isLoading = false;
    }
  }
}