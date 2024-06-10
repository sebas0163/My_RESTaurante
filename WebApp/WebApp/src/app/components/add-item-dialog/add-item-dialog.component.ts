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
  dropdownValuesTime: string[] = [];

  constructor(private authService: AuthenticationService,
    private reservationService: ReservationService,
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableData
  ) {
    // Make a copy of the data to avoid modifying the original data until the form is submitted
    this.editedData = { ...data };
  }

  onInit(): void{
    this.reservationService.getTimes().pipe(first())
      .subscribe((data) => {
        console.log("Times: ", data);
        this.dropdownValuesTime = data;
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

  onSubmit(): void {
    // Submit the edited data and close the dialog
    this.dialogRef.close(this.editedData);
    const user = this.authService.userValue;

    this.reservationService.createReservationAdmin(this.editedData.people, this.editedData.time,
      user!.id
    )    .pipe(first())
      .subscribe((data) => {
        console.log(data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
