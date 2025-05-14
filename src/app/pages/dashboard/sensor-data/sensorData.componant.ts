import { Component, OnDestroy, OnInit, Output} from '@angular/core';
import { Subscription } from 'rxjs';
import { sensorService } from './sensorData.service';
import { AuthService } from '../../authentication/auth.service';
import { KafkaService } from './websocket.service';

/**
 * @title Basic button-toggles
 */
@Component({
  selector: 'sensor-data',
  templateUrl: 'sensorData.componant.html',
 
})
export class sensorDataComponent implements  OnInit , OnDestroy {
    clickedButton: string | null = null;
    @Output() guageValue : number = 0;
    sensorData:any[]=[];
    sensorDataKafka:any[]=[];
    currentData: any;
    userAuthenticated = false ;


    messages: any[] = [];
    private subscription?: Subscription;


   private sensorSub?: Subscription ;
   private sensorSubKafka?: Subscription ;
   private authStatusSub?: Subscription;

   topicConfig: { 
    [key: string]: { unit: string; color: string } 
  } = {
    temperature_celsius: { unit: '°C', color: '#ff6384' },
    humidity: { unit: '%', color: '#36a2eb' },
    air_quality: { unit: '%', color: '#36a2eb' },
    distance: { unit: '%', color: '#36a2eb' },
  };
  /* topics  = [ "co",
    "coo",
    "humidity",
    "temperature",
  ] */
 topics :{ topic: string; unit: string; limit: number; }[]  = [
    {topic:"temperature_celsius" , unit:'°C' , limit:60},
    {topic:"humidity" , unit:'%' , limit:100},
    {topic:"air_quality" , unit:'Pbar' , limit:1000},
    {topic:"distance" , unit:'CM' , limit:500},
  ]
   constructor (public sensorService:sensorService , private authService : AuthService,private kafkaService: KafkaService) {}
  ngOnInit(): void {
    this.sensorService.getData();
    this.sensorSub = this.sensorService.getSensorUPdateListener().subscribe((data: any[])=> {
      this.sensorData = data;
      //console.log(this.sensorData);
    });
    
    this.subscription = this.kafkaService.getMessages().subscribe({
      next: (message) => this.handleNewMessage(message),
      error: (err) => console.error('Kafka error:', err)
    });
    
    this.userAuthenticated=this.authService.getIsAuth();
    this.authStatusSub = this.authService.getOffStatusListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });


  }


  private handleNewMessage(message: any) {
    this.messages = [message, ...this.messages.slice(0, 49)]; // Keep last 200 messages
    
  }

  getConfig(topic: string) {
    return this.topicConfig[topic] || {};
  }

  ngOnDestroy(): void { 
    if(this.sensorSub){
      this.sensorSub.unsubscribe();
    };
    if(this.subscription){
      this.subscription.unsubscribe();
    };
    if(this.sensorSubKafka){
      this.sensorSubKafka.unsubscribe();
    };
    if(this.authStatusSub){
      this.authStatusSub.unsubscribe();
    };
  }

    sensorGauge(buttonName: string,data:number) {
    this.closeGauge();
    this.clickedButton = buttonName;
    this.guageValue = data;
  }

  closeGauge() {
    this.clickedButton = null;
  }
}
