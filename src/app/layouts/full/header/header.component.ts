import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../pages/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl:'./header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  notifications = [
    { icon: 'user', event: 'worker ID 647488 unavailable at station 4', time: '2 mins ago' },
    { icon: 'mail', event: 'Material unavailable at station 1', time: '10 mins ago' },
    { icon: 'list-check', event: 'Machine Id 4646 unavailable at station 1', time: '1 hour ago' },
  ];
  constructor(public dialog: MatDialog ,public authService : AuthService ) {}

  sensorData: any[] = [];

 

  ngOnInit(): void {
    // Fetch sensor data
  /*   this.notificationService.getData().subscribe((data) => {
      this.sensorData = data;
    });

    // Subscribe to notifications
    this.notificationService.getNotifications().subscribe((notifications) => {
     // this.notifications = notifications;
      console.log('Updated notifications:', notifications);
    }); */
  }

  onLogout(){
    this.authService.logout();
  }
}
