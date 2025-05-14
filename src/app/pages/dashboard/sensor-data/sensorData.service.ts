import { Injectable } from "@angular/core";

import { map, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({providedIn:'root'})
export class sensorService {
   private data: any[]= [];
   private dataUpdated = new Subject<any[]>() ;
   constructor(private http:HttpClient){}
   getData() {
    this.http.get<{message:string,sensorData:any}>("http://localhost:3000/api/iotsensordata")
    .pipe(map((sensorData) =>{
        return sensorData.sensorData.map((sensor: { date: any; data: any; typeevent: any; }) => {
           // console.log(sensor)
            return {
                date:sensor.date,
                data:sensor.data,
                typeevent:sensor.typeevent ,
            }
        })
    }))
    .subscribe((transformeddata)=>{
        this.data =  transformeddata;
        this.dataUpdated.next([...this.data]);
    });  
   }

   getSensorUPdateListener(){
    return this.dataUpdated.asObservable()
   }


}