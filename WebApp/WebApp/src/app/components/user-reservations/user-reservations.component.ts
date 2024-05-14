import { Component } from '@angular/core';
import { ReservationService } from '../../_services/reservation.service';
import { first } from 'rxjs';


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

  displayedColumns: string[] = ['time', 'people', 'actions'];
  dataSource: TableData[] = [];

  constructor(private reservationService: ReservationService) {}


  ngOnInit() {
    this.reservationService.getAll()
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
