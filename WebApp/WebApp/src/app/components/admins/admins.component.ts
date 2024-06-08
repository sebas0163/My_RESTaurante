import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent {

  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  recovery_pin: string | undefined;
  loading: boolean | undefined;
  admin_location: string | undefined;
  locals: string[] = ["Alajuela", "San Jose", "Cartago"];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  register() {
    const userRole = "admin";
    this.authService.signIn(this.name!, this.email!, this.password!, userRole, this.recovery_pin!)
      .pipe(first())
      .subscribe({
        next: (user) => {
          // Handle successful response (user data)
          this.loading = false;
          console.log("User: ", user);
          this.openErrorPopup("¡Nuevo admin creado!", "Éxito"); // Open success popup
        },
        error: (error) => {
          // Handle error
          console.error("Error occurred: ", error);
          this.openErrorPopup("Correo o pin inválidos", "Error"); // Open error popup
        }
      });
  }

  openErrorPopup(errorMessage: string, messageTitle: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '250px',
      data: {
        message: errorMessage,
        title: messageTitle
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
