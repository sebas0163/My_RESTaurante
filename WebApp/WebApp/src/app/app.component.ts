import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';
import { Role } from './_models/role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  user?: User | null;

  title = 'My RESTaurant';
  userLoggedIn: any;
  adminLoggedIn: any;
  selectedLocation: string = "";


  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    let  isAdmin = false;
    if(this.user?.access_level == Role.Admin1 || this.user?.access_level == Role.Admin2 || this.user?.access_level == Role.Admin3){
      isAdmin = true;
    }
    return isAdmin;
  }

  get isUser() {
    return this.user?.access_level === Role.User;
  }

  logout() {
    this.authenticationService.logout();
  }

  getAdminLocal(user: String){
    let local = "";
    switch(user) {
      case 'admin-alajuela':
        local = "alajuela";
        break;
      case 'admin-heredia':
        local = "heredia";
        break;
      case 'admin-cartago':
        local = "cartago";
    }
    return local;
  }

  onLocationChange(value: string){

    this.selectedLocation = value;
    if(this.isUser){
      localStorage.setItem('selectedLocation', value);
    } else{
      const adminLocal = this.getAdminLocal(this.authenticationService.userValue?.access_level!);
      localStorage.setItem('selectedLocation', adminLocal);
    }
    // You can perform any action you want here based on the selected location
  }
}