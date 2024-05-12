import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditFormComponent } from '../edit-form/edit-form.component';

export interface TableData {
  id: string;
  time: string;
  name: string;
  email: string;
  people: string;
}

  @Component({
    selector: 'app-admin-reservations',
    templateUrl: './admin-reservations.component.html',
    styleUrl: './admin-reservations.component.scss'
  })
  export class AdminReservationsComponent {
    displayedColumns: string[] = ['name', 'time', 'people', 'actions'];
    dataSource: TableData[] = [];

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    ngOnInit() {
      try{
        this.http.get<TableData[]>('https://us-central1-silken-tenure-419721.cloudfunctions.net/DatabaseControllerTest/api/reservation/getAll')
        .subscribe((data) => {
          
          console.log('In try');
          this.dataSource = data;
          console.log(data);
        },
        (error) => {
          console.error('Error:', error);
        }
      )
  } catch (error) {
    // Log the error (you can remove this line if not needed)
    console.error('Fetch error:', error);
    // Propagate the error by rethrowing it
    throw error;
  }
}

    openEditDialog(row: TableData): void {
      const dialogRef = this.dialog.open(EditFormComponent, {
        width: '250px',
        data: { ...row } // Pass the row data to the edit form component
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Update the row data if the edit form was submitted
          const index = this.dataSource.findIndex(item => item.email === row.email);
          if (index !== -1) {
            this.dataSource[index] = result;
          }
        }
      });
    }
  }
