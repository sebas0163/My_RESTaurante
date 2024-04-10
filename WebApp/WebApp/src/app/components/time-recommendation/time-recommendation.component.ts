import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-time-recommendation',
  templateUrl: './time-recommendation.component.html',
  styleUrls: ['../../app.component.scss']
})
export class TimeRecommendationComponent {


  selectedDate: Date | null = null; // Initialize the property directly

  getRecommendation() {
    console.log(this.selectedDate);
    if(this.selectedDate) console.log(this.selectedDate.toLocaleDateString()); // Transform Date to string using default locale

  }
}
