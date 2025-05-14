import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';


import { Worker } from '../../service/worker.module';
import { WorkerService } from '../../service/worker.service';
import { AddWorkerComponent } from '../add-worker/add-worker.component';

@Component({
  selector: 'app-worker-home',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerHomeComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'first_name', 
    'second_name', 
    'email', 
    'phone_number', 
    'skills', 
    'actions'
  ];
  dataSource: MatTableDataSource<Worker>;
  isLoading = true;
  private workersSub!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public workerService: WorkerService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Worker>([]);
  }

  ngOnInit() {
    this.loadWorkers();
    this.workersSub = this.workerService.getWorkerUpdateListener()
      .subscribe({
        next: (workers) => {
          this.dataSource.data = workers;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error receiving workers updates:', err);
          this.isLoading = false;
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadWorkers() {
    this.isLoading = true;
    this.workerService.getWorkers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(workerId: string) {
    if (confirm('Are you sure you want to delete this worker?')) {
      this.workerService.deleteWorker(workerId).subscribe();
    }
  }

  onEdit(worker: Worker) {
    const dialogRef = this.dialog.open(AddWorkerComponent, {
      width: '800px',
      data: { worker }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWorkers();
      }
    });
  }

  ngOnDestroy() {
    this.workersSub.unsubscribe();
  }
}