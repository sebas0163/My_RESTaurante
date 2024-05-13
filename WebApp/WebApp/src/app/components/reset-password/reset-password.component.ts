import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string | undefined;
  password: string | undefined;
  recovery_pin: string | undefined;


  constructor(private authService: AuthenticationService, private dialog: MatDialog) {}


  resetPassword() {
    this.authService.resetPassword(this.email!, this.password!, this.recovery_pin!)
        .pipe(first())
        .subscribe({
            next: (user) => {
                // Handle successful response (user data)
                console.log("User: ", user);
                this.openErrorPopup("¡Se ha cambiado su contraseña!", "Éxito"); // Open error popup with error message
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