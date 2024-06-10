import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';

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

  constructor(private authService: AuthenticationService, private router: Router, private dialog: MatDialog) {}


  register() {
    const userRole = "regular";
    this.authService.signIn(this.name!, this.email!, this.password!, userRole, this.recovery_pin!)
      .pipe(first())
        .subscribe({
            next: (user) => {
                // Handle successful response (user data)
                this.loading = false;
                console.log("User: ",user);
                this.router.navigate(['/user-login-component']);
                this.openErrorPopup("¡Gracias por registrarse!", "Éxito"); // Open error popup with error message
            },
            error: (error) => {
                // Handle error
                console.error("Error occurred: ", error);
                this.openErrorPopup("Correo o pin inválidos", "Error"); // Open error popup with error message
            }
        });
  }

  openErrorPopup(errorMessage: string, messageTitle: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '250px',
      data: { message: errorMessage,
        title: messageTitle
      } // Pass error message to the popup component
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}