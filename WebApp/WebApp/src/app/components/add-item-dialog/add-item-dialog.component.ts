import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableData } from '../admin-reservations/admin-reservations.component';
import { ReservationService } from '../../_services/reservation.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { first, pipe } from 'rxjs';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.scss'
})
export class AddItemDialogComponent {
  editedData: TableData;
  dropdownValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dropdownValuesQuota: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private authService: AuthenticationService,
    private reservationService: ReservationService,
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
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

    this.editedData.time = this.transformTimeToSecondsFormat(this.editedData.time);


    this.reservationService.createReservationAdmin(user!.email, this.editedData.time, this.editedData.date,
      this.editedData.people, this.editedData.quota
    )
    .pipe(first())
      .subscribe((data) => {
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
