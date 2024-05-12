import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  recovery_pin: string | undefined;
  loading: boolean | undefined;

  constructor(private authService: AuthenticationService) {}

  register() {
    console.log(this.name);
    console.log(this.email);
    console.log(this.password);
    console.log(this.recovery_pin);
    this.authService.signIn(this.name!, this.email!, this.password!, "user", this.recovery_pin!).pipe(first()).subscribe(user => {
      this.loading = false;
      console.log("User: ",user);
  });
  }
}
