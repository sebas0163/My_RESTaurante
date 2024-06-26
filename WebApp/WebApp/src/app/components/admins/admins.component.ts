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
  locals: string[] = ["alajuela", "heredia", "cartago"];
  selectedLocation: string = 'alajuela'; // Set default value to 'alajuela'

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  getAdmin(local: string){
    let admin = "";
    switch(local) {
      case 'alajuela':
        admin = "admin-alajuela";
        break;
      case 'heredia':
        admin = "admin-heredia";
        break;
      case 'cartago':
        admin = "admin-cartago";
    }
    return admin;
  }

  register() {
    const adminLocal = this.getAdmin(this.selectedLocation);
    this.authService.signIn(this.name!, this.email!, this.password!, adminLocal, this.recovery_pin!)
      .pipe(first())
      .subscribe({
        next: (user) => {
          // Handle successful response (user data)
          this.loading = false;
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
