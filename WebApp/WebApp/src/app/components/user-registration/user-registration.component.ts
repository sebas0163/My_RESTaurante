import { Component } from '@angular/core';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  email: string | undefined;
  password: string | undefined;

  constructor() {}

  register() {
    console.log(this.email);
    console.log(this.password);
  }
}
