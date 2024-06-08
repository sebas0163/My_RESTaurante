import { Component } from '@angular/core';
import { ReservationService } from '../../_services/reservation.service';
import { first, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../_services/authentication.service';


export interface TableData {
  id: string;
  time: string;
  name: string;
  email: string;
  people: string;
}

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss'
})
export class UserReservationsComponent {

  displayedColumns: string[] = ['time', 'date', 'people', 'actions'];
  dataSource: TableData[] = [];

  constructor(private reservationService: ReservationService, private dialog: MatDialog, private authService: AuthenticationService,) {}

  ngOnInit() {
    const user = this.authService.userValue;
    this.reservationService.getReservationByEmail(user!.email)
    .pipe(first())
    .subscribe({
        next: (data) => {
          console.log(data);
          this.dataSource = data;
        },
        error: (error) => {
            // Handle error
            console.error("Error occurred: ", error);
        }
    });
}

  editReservation(row: TableData){
    console.log("Row", row);
    console.log("current user: ", localStorage.getItem('user'));
  }


}
