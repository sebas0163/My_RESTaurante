import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MyServiceService } from '../../my-service.service';


@Component({
  selector: 'app-time-recommendation',
  templateUrl: './time-recommendation.component.html',
  styleUrls: ['../../app.component.scss']
})
export class TimeRecommendationComponent {

  showRecommendationContent: boolean = false;

  selectedDate: Date | null = null; // Initialize the property directly\
  times: any = ["3:30pm", "4:30pm", "5:30pm"];
  
  url: any;
  baseUrl: any;

  
  constructor(private myService: MyServiceService, private http: HttpClient) {
    this.baseUrl = this.myService.getData();
    
    this.url = this.baseUrl + '/api/Sentiment/';
    console.log('Current URL:', this.url);
  }

  getDateRecommendation(){
    if(this.selectedDate){
      this.showRecommendationContent = true;
      console.log(this.selectedDate.toLocaleDateString())
    }
    const apiUrl = this.url + `?date=${this.selectedDate}`;
    try {
        this.http.get<any>(apiUrl).subscribe(
          (response) => {
            console.log(response);
            this.times = response.times;
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
}
