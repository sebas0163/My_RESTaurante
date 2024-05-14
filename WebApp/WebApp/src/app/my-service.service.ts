import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://us-central1-silken-tenure-419721.cloudfunctions.net/BackendCore-NewPubSub'
  }

  

  getFeedbackUrl(): string {
    return this.baseUrl + '/api/Sentiment/';
  }

  getTimeUrl(): string {
    return  'http://localhost:8000/api/recomendation/time';
  }

  getMenuUrl(): string {
    return this.baseUrl + '/api/food/menu';
  }
  getMenuRecUrl(): string {
    return this.baseUrl + '/api/food/recomendation';
  }
  

}
