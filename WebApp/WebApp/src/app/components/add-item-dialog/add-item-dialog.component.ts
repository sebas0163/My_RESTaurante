import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableData } from '../admin-reservations/admin-reservations.component';
import { ReservationService } from '../../_services/reservation.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss']
})
export class AddItemDialogComponent implements OnInit {
  editedData: TableData;
  dropdownValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  dropdownValuesTime: any[] = [];
  Times: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
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


  getMatchingValue(Times: { [x: string]: any; }, time: any) {
    for (let key in Times) {
        if (Times[key].datetime === time) {
            return Times[key];
        }
    }
    return null; // Return null if no match is found
}

  onSubmit(): void {
    // Submit the edited data and close the dialog
    this.dialogRef.close(this.editedData);
    const user = this.authService.userValue;
    

    this.reservationService.createReservationAdmin(
      this.editedData.people,
      this.getMatchingValue(this.Times, this.editedData.time).id,
      user!.id
    ).pipe(first())
      .subscribe(
        (data) => {
          window.location.reload();
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

}
