import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MyServiceService } from '../../my-service.service';
import moment from 'moment';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';
import { Role } from '../../_models/role';
import { ReservationService } from '../../_services/reservation.service';
import { first } from 'rxjs';

export interface TableData {
  date: string;
  time: string;
  quota: string;
  selectedPeople: string;
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
  time: string = "June 30, 2024 02:09:49 UTC-6";
  quotaLimit = false;
  dropdownValues: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  people = "0";
  isTimeSelected: boolean = false;
  displayedColumns: string[] = ['time', 'people', 'actions'];
  dataSource: TableData[] = [];
  user: User;
  isUser = false;

  constructor(private myService: MyServiceService,
              private reservationService: ReservationService, 
              private authenticationService: AuthenticationService) {
    this.baseUrl = this.myService.getTimeUrl();
    this.user = <User>this.authenticationService.userValue;
  }

  ngOnInit() {
    this.reservationService.getByLocal()
      .pipe(first())
      .subscribe((data) => {
          this.dataSource = data;
          for (let i = 0; i < this.dataSource.length; i++) {
            if (parseInt(this.dataSource[i].quota) === 0) {
              this.dataSource.splice(i, 1); // Remove the item at index i from dataSource
              i--; // Decrement i to adjust for the removed item
            } else {
              this.dataSource[i].selectedPeople = "1";
            }
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    this.isUser = (this.user?.access_level === Role.User);
  }


  reserve(row: TableData): void {
    if (parseInt(row.quota, 10) === 0) {
      this.quotaLimit = true;
    }
    console.log("ROW DATA: ", row);
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
      this.people,
      this.time
    ).pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }
}
