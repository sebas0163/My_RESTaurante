import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://us-central1-silken-tenure-419721.cloudfunctions.net/Backend/'
    //this.menuUrl = 'http://localhost:1234/api/food/menu';
    //this.menuRecUrl = 'http://localhost:1234/api/food/recomendation';
  }

  getFeedbackUrl(): string {
    return this.baseUrl + 'api/Sentiment/';
  }

  getTimeUrl(): string {
    return  'http://localhost:1234/api/recomendation/time';
  }

  getMenuUrl(): string {
    return 'http://localhost:1234/api/food/menu';
  }
  getMenuRecUrl(): string {
    return 'http://localhost:1234/api/food/recomendation';
  }
  

}
