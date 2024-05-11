import { Component } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  email: string | undefined;
  password: string | undefined;
  
  loading = false;
  user: User | undefined;
  userFromApi?: User;

  constructor(private userService: UserService) {}

  login() {
    console.log(this.email);
    console.log(this.password);
    this.userService.getUser(this.email!, this.password!).pipe(first()).subscribe(user => {
      this.loading = false;
      this.userFromApi = user;
  });
  }


  async ngOnInit() {
    this.loading = true;

  }

}


