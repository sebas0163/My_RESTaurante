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


  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    return this.user?.access_level === Role.Admin;
  }

  get isUser() {
    return this.user?.access_level === Role.User;
  }

  logout() {
    this.authenticationService.logout();
  }
}