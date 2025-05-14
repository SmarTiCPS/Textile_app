import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData, LoginData } from "./auth-data.module";
import { response } from "express";
import { Observable, Subject, take } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})

export class AuthService {
    private isAuthenticated = false ;
    private token?:string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http:HttpClient ,private router : Router){}
    getToken(){
        return this.token;
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    getOffStatusListener(){
        return this.authStatusListener.asObservable();
    }
    uploadPhoto(formData: FormData): Observable<any> {
        return this.http.post('http://localhost:3000/api/upload', formData).pipe(
            take(1)
        );
    }

    createUser(userData: any): Observable<any> {
        return this.http.post('http://localhost:3000/api/signupuser', userData).pipe(
            take(1)
        );
    }
    login(email:string,password:string){
        const authLogin : LoginData = {email:email , password :password};
        this.http.post<{token:string}>("http://localhost:3000/api/login",authLogin).subscribe(response=>{
            console.log(response);
            const token = response.token;
            this.token=token;
            if(token){
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(['/dashboard/dashboard']);
            }
        })
    }
    logout (){
        this.token = "" ;
        this.isAuthenticated = false ;
        this.authStatusListener.next(false);
        this.router.navigate(['/authentication/login']);
    }
}