import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FactoryService } from '../../services/factory.service';
import { Observable, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-factory',
  templateUrl: './add-factory.component.html',
  styleUrls: ['./add-factory.component.css']
})
export class AddFactoryComponent {
  factoryForm: FormGroup;
  selectedPhoto: File | null = null;
  selectedModel: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private factoryService: FactoryService,
    private dialogRef: MatDialogRef<AddFactoryComponent>,
    private snackBar: MatSnackBar
  ) {
    this.factoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      modelPath: [''],
      photo: ['']
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedPhoto = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedPhoto);
    }
  }

  onModelSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedModel = input.files[0];
    }
  }

  async onSubmit() {
    if (this.factoryForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      let photoPath = '';
      let modelPath = '';

      // Upload files if they exist
      if (this.selectedPhoto) {
        photoPath = await this.uploadFile(this.selectedPhoto, 'photo');
      }
      if (this.selectedModel) {
        modelPath = await this.uploadFile(this.selectedModel, 'model');
      }

      // Prepare factory data
      const factoryData = {
        name: this.factoryForm.value.name,
        address: this.factoryForm.value.address,
        modelPath: modelPath,
        photo: photoPath
      };

      // Add factory and wait for completion
      await lastValueFrom(this.factoryService.addFactory(factoryData));

      this.snackBar.open('Factory added successfully!', 'Close', {
        duration: 3000
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open('Error creating factory: ' + (error as Error).message, 'Close', {
        duration: 5000
      });
    } finally {
      this.isLoading = false;
    }
  }

  private uploadFile(file: File, type: 'photo' | 'model'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const upload$ = this.factoryService.uploadFile(formData, type);
    
    return lastValueFrom(upload$).then(response => {
      if (!response?.path) {
        throw new Error('No path returned from server');
      }
      return response.path;
    });
  }
}