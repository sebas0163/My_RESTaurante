import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditFormComponent } from '../edit-form/edit-form.component';

export interface TableData {
  full_name: string;
  date: string;
  time: string;
  people: string;
}

  @Component({
    selector: 'app-admin-reservations',
    templateUrl: './admin-reservations.component.html',
    styleUrl: './admin-reservations.component.scss'
  })
  export class AdminReservationsComponent {
    displayedColumns: string[] = ['full_name', 'date', 'time', 'people', 'actions'];
    dataSource: TableData[] = [];

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    ngOnInit() {
      this.http.get<TableData[]>('../assets/mockReservations.json')
        .subscribe(data => this.dataSource = data);
    }

    openEditDialog(row: TableData): void {
      const dialogRef = this.dialog.open(EditFormComponent, {
        width: '250px',
        data: { ...row } // Pass the row data to the edit form component
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Update the row data if the edit form was submitted
          const index = this.dataSource.findIndex(item => item.full_name === row.full_name);
          if (index !== -1) {
            this.dataSource[index] = result;
          }
        }
      });
    }
  }
