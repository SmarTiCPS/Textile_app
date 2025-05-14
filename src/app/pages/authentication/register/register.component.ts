import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  form = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    secondname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    telnumber: new FormControl('', [Validators.required]),
    addresses: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required])
  });

  confirmPassword: string = '';
  selectedFile: File | null = null;
  photoError: string | null = null;
  isLoading = false;
  uploadProgress = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  get f() {
    return this.form.controls;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.photoError = 'Only JPG, PNG or GIF images are allowed';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.photoError = 'Image size should be less than 2MB';
        return;
      }

      this.selectedFile = file;
      this.photoError = null;
    }
  }

  removePhoto() {
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.form.invalid || !this.selectedFile || this.form.value.password !== this.confirmPassword) {
        return;
    }

    this.isLoading = true;
    const formData = new FormData();
    
    // Properly append the file with the correct field name
    formData.append('photo', this.selectedFile, this.selectedFile.name); // Add filename as third parameter
    
    console.log('Selected file:', this.selectedFile); // Verify file exists

    // First upload the photo
    this.authService.uploadPhoto(formData).subscribe({
        next: (photoResponse: any) => {
            console.log('Upload response:', photoResponse);
            
            // Verify photoResponse has the expected structure
            if (!photoResponse?.path) {
                throw new Error('Invalid photo upload response');
            }

            const userData = {
                firstname: this.form.value.firstname,
                secondname: this.form.value.secondname,
                email: this.form.value.email,
                password: this.form.value.password,
                telnumber: this.form.value.telnumber,
                addresses: this.form.value.addresses,
                birthday: this.form.value.birthday,
                photo: photoResponse.path
            };
            console.log('User data:', userData);

            this.authService.createUser(userData).subscribe({
                next: () => {
                    this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
                    this.router.navigate(['/authentication/login']);
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.snackBar.open('Registration failed: ' + error.message, 'Close', { duration: 5000 });
                }
            });
        },
        error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Photo upload failed: ' + error.message, 'Close', { duration: 5000 });
        }
    });
}
}