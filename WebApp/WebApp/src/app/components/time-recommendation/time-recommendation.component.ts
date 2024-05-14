import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MyServiceService } from '../../my-service.service';
import moment from 'moment';


@Component({
  selector: 'app-time-recommendation',
  templateUrl: './time-recommendation.component.html',
  styleUrls: ['../../app.component.scss'],
  
})
export class TimeRecommendationComponent {

  showRecommendationContent: boolean = false;

  selectedDate: Date | null = null; // Initialize the property directly
  times: any = [];
  baseUrl: any;

  
  constructor(private myService: MyServiceService, private http: HttpClient) {
    this.baseUrl = this.myService.getTimeUrl();
  }

  getDateRecommendation(){
    if(this.selectedDate){
      this.showRecommendationContent = true;
      console.log(this.selectedDate.toLocaleDateString())
    }
    try {
        this.http.get<any>('apiUrl').subscribe(
          (response) => {
            console.log(response);
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
          this.times = this.times.map((item: moment.MomentInput) => moment(item).format('MMMM D, YYYY, h:mm A'));
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }


}
