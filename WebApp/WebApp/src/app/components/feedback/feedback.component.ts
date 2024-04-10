import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['../../app.component.scss']
})
export class FeedbackComponent {

  textareaValue: string = ''; // Initialize textarea value

  constructor() { }

  getFeedbackResponse(){
    console.log(this.textareaValue);
  }
}
