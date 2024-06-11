import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MyServiceService } from '../../my-service.service';
import moment from 'moment';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';
import { Role } from '../../_models/role';
import { ReservationService } from '../../_services/reservation.service';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';

export interface TableData {
  name: string;
  date: string;
  time: string;
  timeid:string;
  reservationId:string;
  quota: string;
  people: string;
}

@Component({
  selector: 'app-time-recommendation',
  templateUrl: './time-recommendation.component.html',
  styleUrls: ['./time-recommendation.scss'],
})
export class TimeRecommendationComponent {
  showRecommendationContent: boolean = false;
  selectedDate: Date | null = null; // Initialize the property directly
  times: any = [];
  baseUrl: any;
  date: string | undefined;
  time: string = "";
  newtime: string = "June 30, 2024 02:09:49 UTC-6";
  timeid: string = "";
  quotaLimit = false;
  dropdownValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  people = "0";
  isTimeSelected: boolean = false;
  displayedColumns: string[] = ['time', 'people', 'actions'];
  dataSource: TableData[] = [];
  user: User;
  isUser = false;
  slots = "0";
  
  dropdownValuesTime: any[] = [];
  Times: any[] = [];

  constructor(private myService: MyServiceService,
              private reservationService: ReservationService, 
              private authenticationService: AuthenticationService, private dialog: MatDialog) {
    this.baseUrl = this.myService.getTimeUrl();
    this.user = <User>this.authenticationService.userValue;
  }


  getReservations(){
      const location = localStorage.getItem('selectedLocation');
      this.reservationService.getByLocal(location!)
    .pipe(first())
    .subscribe((data) => {
        this.dataSource = data;
        
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getTimes(){
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


  ngOnInit() {
    this.getReservations();
    this.getTimes();


    this.isUser = (this.user?.access_level === Role.User);
  }


  reserve(row: TableData): void {
    if (parseInt(row.quota, 10) === 0) {
      this.quotaLimit = true;
    }

    this.reservationService.editReservationAdmin(row.people, row.reservationId, this.user.id, row.timeid
    ).pipe(first())
    .subscribe({
      next: (user) => {
          // Handle successful response (user data)
          this.openErrorPopup("¡Se ha creado la reservacion!", "Éxito"); // Open error popup with error message
      },
      error: (error) => {
          // Handle error
          console.error("Error occurred: ", error);
          this.openErrorPopup("No se ha podido crear la reservacion, intente de nuevo mas tarde", "Error"); // Open error popup with error message
      }
  });
  }

  openErrorPopup(errorMessage: string, messageTitle: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '250px',
      data: { message: errorMessage,
        title: messageTitle
      } // Pass error message to the popup component
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  getAdminLocal() {
    const user = localStorage.getItem('user');

    const dataObject = JSON.parse(user!);
    const accessLevel = dataObject.access_level;
    const parts = accessLevel.split("admin-");
    const local = parts[1];
    return local;
  }

  createNewTime(): void {
    const adminLocal = this.getAdminLocal();
    this.reservationService.createNewTime(
      adminLocal,
      this.slots,
      this.newtime
    ).pipe(first())
      .subscribe(
        (data: any) => {
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }

  getMatchingValue(Times: { [x: string]: any; }, time: any) {
    for (let key in Times) {
        if (Times[key].datetime === time) {
            return Times[key];
        }
    }
    return null; // Return null if no match is found
}

  createNewReservation(): void {
    this.reservationService.createReservationAdmin(
      this.people,
      this.getMatchingValue(this.Times, this.time).id,
      this.user.id
    ).pipe(first())
      .subscribe(
        (data: any) => {
          console.log("Create res: ", data);
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }
      
}
