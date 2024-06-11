import { Component } from '@angular/core';
import { ReservationService } from '../../_services/reservation.service';
import { first, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../_services/authentication.service';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { EditFormComponent } from '../edit-form/edit-form.component';


export interface TableData {
  name: string;
  people: string;
  reservationId: string;
  user: string;
  time: string;
  timeid: string;
  date: string;
  local: string;
}


@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss'
})
export class UserReservationsComponent {

  displayedColumns: string[] = ['email', 'time', 'people', 'actions'];
  dataSource: TableData[] = [];

  constructor(private reservationService: ReservationService, private dialog: MatDialog, private authService: AuthenticationService,) {}

  ngOnInit() {
    const user = this.authService.userValue;
    this.reservationService.getReservationByEmail(user!.email)
    .pipe(first())
    .subscribe({
        next: (data) => {
          this.dataSource = data;
          console.log("print", data);
        },
        error: (error) => {
            // Handle error
            console.error("Error occurred: ", error);
        }
    });
}


openEditDialog(row: TableData): void {
  const dialogRef = this.dialog.open(EditFormComponent, {
    width: '250px',
    data: { ...row } // Pass the row data to the edit form component
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Update the row data if the edit form was submitted
      const index = this.dataSource.findIndex(item => item.user === row.user);
      if (index !== -1) {
        this.dataSource[index] = result;
      }
    }
  });
}


}
