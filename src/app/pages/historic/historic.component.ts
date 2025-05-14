import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { sensorService } from '../video-page/sensor.service';
import { AuthService } from '../authentication/auth.service';
import { EchartGraphComponent } from "./echart-graph/echart-graph.component";
import { HistaoricDataService } from './service/histaoric-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AttributeService } from '../devices/service/attribute.service';
import { Attribute } from '../devices/service/device.module';
interface topicEvent {
  idtypeevent : string,
  typeevent : string,
}
@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.scss',
})
export class HistoricComponent implements  OnInit , OnDestroy {
   
    topics  = [ "co",
      "coo",
      "humidity",
      "temperature",
    ]
clickedButton: string | null = null;
    @Output() guageValue : number = 0;
    userAuthenticated = false ;
    attributes: Attribute[] = [];
  isLoading = false;
   private eventTypeSub?: Subscription;
   private authStatusSub?: Subscription;
  private attributesSub?: Subscription;

   constructor ( 
    private authService : AuthService ,
    private historicSensorService : HistaoricDataService , 
    private attributeService : AttributeService) {}
  ngOnInit(): void {
 // Now you can use `start` and `end` to call your service
 this.loadAttributes();
 this.attributesSub = this.attributeService.getAttributesUpdateListener()
   .subscribe({
     next: (attributes) => {
       this.attributes = attributes;
       this.isLoading = false;
     },
     error: (err) => {
       console.error('Error receiving attributes updates:', err);
       this.isLoading = false;
     }
   });
    this.userAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getOffStatusListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    }); 
  }
  loadAttributes() {
    this.isLoading = true;
    this.attributeService.getAttributes();
  }
  ngOnDestroy(): void { 
    // Only unsubscribe if subscription exists
    if (this.eventTypeSub) {
      this.eventTypeSub.unsubscribe();
    }
    
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
    
    if (this.attributesSub) {
      this.attributesSub.unsubscribe();
    }
  }


}
