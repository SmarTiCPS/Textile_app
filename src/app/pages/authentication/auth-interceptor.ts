import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthIntercerptor implements HttpInterceptor {
    constructor(private authService : AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers:req.headers.set('Authorization',"bearer "+ authToken)
        });

        return next.handle(authRequest);

    }
}