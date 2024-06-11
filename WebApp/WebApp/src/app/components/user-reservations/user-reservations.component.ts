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
  id: string;
  user: string;
  time: string;
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
          console.log("DATA res", data);
          this.dataSource = data;
        },
        error: (error) => {
            // Handle error
            console.error("Error occurred: ", error);
        }
    });
}

editReservation(row: TableData){
  const user = this.authService.userValue;
  this.reservationService.editReservationAdmin(row.people, row.time, user!.id)
  .pipe(first())
  .subscribe({
      next: (data) => {
        this.dataSource = data;
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
        this.editReservation(row);
      }
    }
  });
}

openAddItemDialog(): void {
  const dialogRef = this.dialog.open(AddItemDialogComponent, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Add the new item to the data source
      this.dataSource.push(result);
    }
  });
}
}
