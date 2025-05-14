import { ChangeDetectionStrategy, Component, Inject, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { AuthService } from '../../authentication/auth.service';
import { HistaoricDataService } from '../service/histaoric-data.service';
import { JsonPipe } from '@angular/common';

interface dataFormat {
  data: string;
  date: string;
  typeevent: string;
}

@Component({
  selector: 'app-db-graph',
  templateUrl: 'db-echart.component.html',
  styleUrl: './db-graph.component.scss',
})
export class DbGraphComponent {
  @Input() topicData!: { idtypeevent: string; typeevent: string };
  clickedButton: string | null = null;
  sensorData: any[] = [];
  eventTypeData: any[] = [];
  userAuthenticated = false;

  messages: any[] = [];

  // Helper method to format date to ISO 8601
  private formatDateToISO(date: Date): string {
    return date.toISOString();
  }

  private sensorSub: Subscription | any;
  private eventTypeSub: Subscription | any;
  private authStatusSub?: Subscription;

  constructor(
    public historicSensorService: HistaoricDataService,
    private authService: AuthService
  ) {}

  dialog = inject(MatDialog);

  // Create a new dateRange object for each instance
  dateRange = { startDate: null, endDate: null };

  openDialog() {
    // Create a deep copy of the dateRange object
    const dateRangeCopy = {
      startDate: this.dateRange.startDate ? new Date(this.dateRange.startDate) : null,
      endDate: this.dateRange.endDate ? new Date(this.dateRange.endDate) : null,
    };

    const dialogRef = this.dialog.open(DatepickerDialogExampleDialog, {
      width: '600px',
      data: { ...dateRangeCopy, idtypeevent: this.topicData.idtypeevent }, // Pass the copy and unique identifier
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update the local dateRange object
        this.dateRange = result;

        // Now you can use `start` and `end` to call your service
        this.historicSensorService.getData(
          result.start,
          result.end,
          this.topicData.idtypeevent
        );
       /*  this.sensorSub = this.historicSensorService
          .getSensorUPdateListener()
          .subscribe((data: any[]) => {
            this.sensorData = data;
            console.log(this.sensorData);
          });
 */
        this.userAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
          .getOffStatusListener()
          .subscribe((isAuthenticated) => {
            this.userAuthenticated = isAuthenticated;
          });
      }
    });
  }
}
@Component({
  selector: 'app-db-graph-dialogue',
  templateUrl: 'db-graph.component.html',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerDialogExampleDialog {
  // Define the range FormGroup for the date range picker
  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required), // Start date control
    end: new FormControl<Date | null>(null, Validators.required),   // End date control
  });

  // Define the rangeForm FormGroup for the entire form (including time inputs)
  rangeForm = new FormGroup({
    range: this.range, // Include the range FormGroup
    startTime: new FormControl<string>('00:00', Validators.required), // Start time control
    endTime: new FormControl<string>('23:59', Validators.required),   // End time control
  });

  constructor(
    private dialogRef: MatDialogRef<DatepickerDialogExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { startDate: Date | null; endDate: Date | null } // Inject dialog data
  ) {
    // Initialize the form with the data passed to the dialog
    this.range.patchValue({
      start: data.startDate,
      end: data.endDate,
    });
  }

  onSave() {
    // Safely access start, end, startTime, and endTime
    const start = this.combineDateAndTime(
      this.range.value.start ?? null, // Fallback to null if undefined
      this.rangeForm.value.startTime ?? null
    );
    const end = this.combineDateAndTime(
      this.range.value.end ?? null, // Fallback to null if undefined
      this.rangeForm.value.endTime ?? null
    );

    // Format to ISO 8601 (UTC)
    const formattedStart = start?.toISOString();
    const formattedEnd = end?.toISOString();

    // Close the dialog and return the formatted range
    this.dialogRef.close({
      start: formattedStart,
      end: formattedEnd,
    });
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog without saving
  }

  private combineDateAndTime(date: Date | null | undefined, time: string | null | undefined): Date | null {
    if (!date || !time) return null; // Handle null or undefined

    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Create a new date object with the combined date and time
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds

    return combinedDate;
  }
}