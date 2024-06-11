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
  isDeleted: boolean = false;
  dropdownValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dropdownValuesTime: string[] = [];
  Times: any[] = [];
  
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

  ngOnInit(): void {
    this.reservationService.getTimes().pipe(first())
      .subscribe(
        (data) => {
          data.forEach((element: any) => {
            this.Times.push(element);
            this.dropdownValuesTime.push(element.datetime);
          });
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  onCancel(): void {
    // Close the dialog without saving changes
    this.dialogRef.close();
  }


transformDateToHyphenFormat(date: string): string {
  return date.replace(/\//g, '-');
}


  onDelete(): void {
    // Open delete confirmation dialog
    this.isDeleteDialogOpen = true;
  }


  confirmDelete() {
    this.reservationService.deleteReservation(this.data.id!)
        .pipe(first())
        .subscribe({
            next: (data) => {
                // Handle successful response (user data)
                this.openErrorPopup("Se ha eliminado la reservación", "Éxito"); // Open error popup with error message
                this.isDeleted = true;
            },
            error: (error) => {
                // Handle error
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


  onSubmit(): void {
    // Submit the edited data and close the dialog
    this.dialogRef.close(this.editedData);
    const user = this.authService.userValue;

    console.log("Edited data: ", this.editedData);

    this.reservationService.editReservationAdmin(this.editedData.people, this.editedData.time, user!.id, user!.id)
    .pipe(first())
      .subscribe((data) => {
        console.log(data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
