import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  constructor(public authService : AuthService){}
  isLoading = false ;
  onLogin(form:NgForm){
    if (form.invalid){
      return;
    };
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);

  }
}
 