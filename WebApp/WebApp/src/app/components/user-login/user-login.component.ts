import { Component } from '@angular/core';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  email: string | undefined;
  password: string | undefined;

  constructor() {}

  login() {
    console.log(this.email);
    console.log(this.password);
  }
}


