import { Component } from '@angular/core';
import { User } from '../../_models/user';
import { first } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthenticationService, private dialog: MatDialog, private router: Router) {}
  

  async ngOnInit() {
    this.loading = true;

  }


  login() {
    this.authService.login(this.email!, this.password!)
        .pipe(first())
        .subscribe({
            next: (user) => {
              this.loading = false;
              this.userFromApi = user;
              this.router.navigate(['/menu-component']);
            },
            error: (error) => {
                // Handle error
                console.error("Error occurred: ", error);
                this.openErrorPopup("Correo o pin inválidos"); // Open error popup with error message
            }
        });
  }

  openErrorPopup(errorMessage: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '250px',
      data: { message: errorMessage } // Pass error message to the popup component
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
