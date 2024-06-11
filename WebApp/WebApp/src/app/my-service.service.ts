import { Injectable } from '@angular/core';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.apiUrl;
  }

  getFeedbackUrl(): string {
    return this.baseUrl + '/api/Sentiment/';
  }

  getTimeUrl(): string {
    return  this.baseUrl + '/api/recomendation/time';
  }

  getMenuUrl(): string {
    return this.baseUrl + '/api/food/menu';
  }
  getMenuRecUrl(): string {
    return this.baseUrl + '/api/food/recomendation';
  }


}
