import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MyServiceService } from '../../my-service.service';
import moment from 'moment';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';
import { Role } from '../../_models/role';

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
  time: string | undefined;
  quotaLimit = false;

  isTimeSelected: boolean = false;

  displayedColumns: string[] = ['date', 'time', 'quota', 'people', 'actions'];
  dataSource: TableData[] = [];
  
  user: User;
  isUser = false;

  
  constructor(private myService: MyServiceService,
    private http: HttpClient,
    private authenticationService: AuthenticationService) {
    this.baseUrl = this.myService.getTimeUrl();
    this.user = <User>this.authenticationService.userValue;

  }

  ngOnInit() {
    this.http.get<TableData[]>('../assets/mockTimeAvailability.json')
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
  

  getDateRecommendation(){
    if(this.selectedDate){
      this.showRecommendationContent = true;
    }
    try {
        this.http.get<any>(this.baseUrl).subscribe(
          (response) => {
            console.log("Times", response);
            this.times = response.times;
          },
          (error) => {
            console.error('Error:', error);
          }
        )
    } catch (error) {
      console.error('Fetch error:', error);
      // Propagate the error by rethrowing it
      throw error;
    }
  }


  postDateRecommendation() {

    if (this.selectedDate) {
      this.showRecommendationContent = true;

      const body = {
        "day": this.selectedDate.toLocaleDateString()
      }

      // Make the POST request
      this.http.post<any>(this.baseUrl, body).subscribe(
        (response) => {
          this.times = response;
          console.log(response);
          this.times = this.times.map((item: moment.MomentInput) => moment(item).format('MMMM D, YYYY, h:mm A'));
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }


  updateSelection(time: string) {
    this.isTimeSelected = true;
  }


  reserve(row: TableData): void {
    if (parseInt(row.quota, 10) == 0) {
      this.quotaLimit = true;
    }
  }


}
