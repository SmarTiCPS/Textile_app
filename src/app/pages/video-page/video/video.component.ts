import { Component, OnDestroy, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { sensorService } from '../sensor.service';
import { AuthService } from '../../authentication/auth.service';
import { Subscription } from 'rxjs';

export interface SensorVAl {
  id:Number,
  typeevent: String,
  date : String,
  data : String,
}

export interface camData {
  id: number;
  imagePath: string;
  ipAddress: string;
  position: string;
  hourRate: number;
  classes: number;
  priority: string;
}
// ecommerce card
interface productcards {
  id: number;
  vidSrc: string;
  title: string;
  state:number;
  ipAddress : string,
}

const ELEMENT_DATA: camData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    ipAddress: 'localhost:3000/cam1',
    position: 'English',
    hourRate: 150,
    classes: 53,
    priority: 'Available',
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    ipAddress: 'localhost:3000/cam2',
    position: 'Project Manager',
    hourRate: 150,
    classes: 68,
    priority: 'In Class',
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    ipAddress: 'localhost:3000/cam3',
    position: 'Project Manager',
    hourRate: 150,
    classes: 94,
    priority: 'Absent',
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    ipAddress: 'localhost:3000/cam4',
    position: 'Frontend Engineer',
    hourRate: 150,
    classes: 27,
    priority: 'On Leave',
  },
];
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html'
})
export class AppVideoComponent implements OnInit,AfterViewInit,OnDestroy {
  selected = 'option2';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns: string[] = ['id','typeevent','date',"data"];
  dataSource: MatTableDataSource<SensorVAl>;
 
 sensorData:any[]=[];

    userAuthenticated = false ;
   private sensorSub: Subscription | any;
   private authStatusSub?: Subscription;

   constructor (public sensorService:sensorService , private authService : AuthService) {
        // Create 100 users
        //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.sensorData);
   }
  ngOnInit(): void {
    this.sensorService.getData();
    this.sensorSub = this.sensorService.getSensorUPdateListener().subscribe((data: any[])=> {
      this.sensorData = data;
      this.dataSource = new MatTableDataSource(this.sensorData);
      //console.log(this.dataSource);
    });
    
    this.userAuthenticated=this.authService.getIsAuth();
    this.authStatusSub = this.authService.getOffStatusListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void { 
    this.sensorSub.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }
  

 

 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.paginator);
    console.log(this.sort);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
     // ecommerce card
     productcards: productcards[] = [
      {
        id: 1,
        vidSrc : 'cam1_20250225_101009.avi',
        title: 'cam A',
        ipAddress: 'localhost:3000/cam4',
        state:1,
      },
      {
        id: 2,
        vidSrc : 'cam1_20250225_101009.avi',
        title: 'cam B',
        ipAddress: 'localhost:3000/cam4',
        state:0,
      },
      {
        id: 3,
        vidSrc : 'cam1_20250225_101009.avi',
        title: 'cam C',
        ipAddress: 'localhost:3000/cam4',
        state:0,
      },
      {
        id: 4,
        vidSrc : 'cam1_20250225_101009.avi',
        title: 'cam D',
        ipAddress: 'localhost:3000/cam4',
        state:1,
      },
      {
        id: 5,
        vidSrc : 'cam1_20250225_101009.avi',
        title: 'cam E',
        ipAddress: 'localhost:3000/cam4',
        state:1,
      },
    ];
  

}
