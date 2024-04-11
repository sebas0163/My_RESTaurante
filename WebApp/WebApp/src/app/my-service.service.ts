import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private feedbackUrl: string;
  private timeUrl: string;
  private menuUrl: string;
  private menuRecUrl: string;

  constructor() {
    this.feedbackUrl = 'https://us-central1-silken-tenure-419721.cloudfunctions.net/Backend/api/Sentiment/';
    this.timeUrl = 'http://localhost:1234/api/recomendation/time';
    this.menuUrl = 'http://localhost:1234/api/food/menu';
    this.menuRecUrl = 'https://us-central1-silken-tenure-419721.cloudfunctions.net/Backend/api/';
  }

  getFeedbackUrl(): string {
    return this.feedbackUrl;
  }

  getTimeUrl(): string {
    return this.timeUrl;
  }
  getMenuUrl(): string {
    return this.menuUrl;
  }
  getMenuRecUrl(): string {
    return this.menuRecUrl;
  }

}
