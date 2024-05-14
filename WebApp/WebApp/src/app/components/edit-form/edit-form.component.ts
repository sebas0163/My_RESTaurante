import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TableData } from '../admin-reservations/admin-reservations.component';
import { ReservationService } from '../../_services/reservation.service';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { first } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent {
  editedData: TableData;
  isDeleteDialogOpen: boolean = false;
  dropdownValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dropdownValuesQuota: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  reservationID: string | undefined;

  constructor(
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableData
  ) {
    // Make a copy of the data to avoid modifying the original data until the form is submitted
    this.editedData = { ...data };
  }

  onCancel(): void {
    // Close the dialog without saving changes
    this.dialogRef.close();
  }

  transformTimeToSecondsFormat(time: string): string {
    const parts = time.split(':');
    if (parts.length === 2) {
        // Format is "hh:mm"
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
    } else if (parts.length === 1 && parts[0].length <= 2) {
        // Format is "h"
        return `${parts[0].padStart(2, '0')}:00:00`;
    } else {
        throw new Error('Invalid time format');
    }
}


  onSubmit(): void {
    // Submit the edited data and close the dialog
    this.dialogRef.close(this.editedData);
    const user = this.authService.userValue;
    console.log("DATA: ", user!.email);

    // Example usage
    const timeWithSeconds1 = this.transformTimeToSecondsFormat(this.editedData.time);
    console.log("TIME: ", timeWithSeconds1); // Output: 12:34:00
        
  }

  onDelete(): void {
    // Open delete confirmation dialog
    this.isDeleteDialogOpen = true;
  }


  confirmDelete() {
    console.log("ID", this.data.id);
    this.reservationService.deleteReservation(this.data.id!)
        .pipe(first())
        .subscribe({
            next: (data) => {
                // Handle successful response (user data)
                console.log("DELETE: ", data);
                this.openErrorPopup("Se ha eliminado la reservación", "Éxito"); // Open error popup with error message
            },
            error: (error) => {
                // Handle error
                console.error("Error occurred: ", error);
                this.openErrorPopup("Ocurrió un error al eliminar la reserva", "Error"); // Open error popup with error message
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

  cancelDelete(): void {
    // Close delete confirmation dialog
    this.isDeleteDialogOpen = false;
  }
}
