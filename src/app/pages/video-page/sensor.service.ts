import { Injectable } from "@angular/core";

import { map, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({providedIn:'root'})
export class sensorService {
   private data: any[]= [];
   private dataUpdated = new Subject<any[]>() ;
   constructor(private http:HttpClient){}
   getData() {
    this.http.get<{message:string,sensorData:any}>("http://localhost:3000/api/alliotsensordata")
    .pipe(map((sensorData) =>{
        return sensorData.sensorData.map((sensor: {id:any, date: any; data: any; typeevent: any; }) => {
           // console.log(sensor)
            return {
                id:sensor.id,
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