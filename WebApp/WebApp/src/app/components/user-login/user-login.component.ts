import { Component } from '@angular/core';
import { User } from '../../_models/user';
import { first } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'] // Corrected spelling of styleUrls
})
export class UserLoginComponent {
  email: string | undefined;
  password: string | undefined;
  
  loading = false;
  user: User | undefined;
  userFromApi?: User;

  constructor(private authService: AuthenticationService) {}
  

  login() {
    this.authService.login(this.email!, this.password!).pipe(first()).subscribe(user => {
      this.loading = false;
      this.userFromApi = user;
  });
  }


  async ngOnInit() {
    this.loading = true;

  }

}
