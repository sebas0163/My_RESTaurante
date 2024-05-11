import { Component } from '@angular/core';


export interface TableData {
  full_name: string,
  date: string;
  time: string;
  people: string;
}

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.css'
})
export class UserReservationsComponent {

  displayedColumns: string[] = ['full_name', 'date', 'time', 'people', 'actions'];
  dataSource: TableData[] = [];


  editReservation(row: TableData){
    console.log(row);
  }


}
