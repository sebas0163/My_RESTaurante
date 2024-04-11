import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private url: string;

  constructor() {
    this.url = 'https://us-central1-silken-tenure-419721.cloudfunctions.net/Backend/api/';
  }

  getData(): string {
    return this.url;
  }

  setData(data: string): void {
    this.url = data;
  }
}
