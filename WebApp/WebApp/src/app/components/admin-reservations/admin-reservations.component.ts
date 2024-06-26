import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { ReservationService } from '../../_services/reservation.service';
import { first } from 'rxjs';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';

export interface TableData {
  name: string;
  people: string;
  id: string;
  reservationId: string;
  user: string;
  time: string;
  timeid: string;
  date: string;
  local: string;
}

  @Component({
    selector: 'app-admin-reservations',
    templateUrl: './admin-reservations.component.html',
    styleUrl: './admin-reservations.component.scss'
  })
  export class AdminReservationsComponent {
    displayedColumns: string[] = ['time', 'local', 'name', 'people', 'actions'];
    dataSource: TableData[] = [];


    constructor(private reservationService: ReservationService, private http: HttpClient, private dialog: MatDialog) {}

    getAdminLocal(user: String){
      let local = "";
      switch(user) {
        case 'admin-alajuela':
          local = "alajuela";
          break;
        case 'admin-heredia':
          local = "heredia";
          break;
        case 'admin-cartago':
          local = "cartago";
      }
      return local;
    }
    
    ngOnInit() {
      const user = localStorage.getItem('user');
      
      const userobj = JSON.parse(user!);
      const location = this.getAdminLocal(userobj.access_level);
      this.reservationService.getByLocal(location!)
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
          const index = this.dataSource.findIndex(item => item.id === row.id);
          if (index !== -1) {
            this.dataSource[index] = result;
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
