import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { MyServiceService } from '../../my-service.service';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['../../app.component.scss']
})
export class FeedbackComponent {

  textareaValue: string = ''; // Initialize textarea value
  rating: number = 0;
  feedbackResponse: string = '';
  response: string = '';
  is_feedback: boolean = false;
  baseUrl: any;

  
  constructor(private myService: MyServiceService, private http: HttpClient) {
    this.baseUrl = this.myService.getFeedbackUrl();
  }



  rate(index: number) {
    this.rating = index;
  }

  getFeedbackResponse(){
    try {
      const apiUrl = this.baseUrl + `?feedback=${this.textareaValue}`;
      if (this.textareaValue != '') {

        this.http.get<any>(apiUrl).subscribe(
          (response) => {
            this.rate(response.score);
            this.feedbackResponse = response.texto;
            console.log(this.feedbackResponse);

          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
      else
        this.is_feedback = true;
    } catch (error) {
      // Log the error (you can remove this line if not needed)
      console.error('Fetch error:', error);
      // Propagate the error by rethrowing it
      throw error;
    }
  }

}
