import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private url: string;

  constructor() {
    this.url = 'http://localhost:1234';
  }

  getData(): string {
    return this.url;
  }

  setData(data: string): void {
    this.url = data;
  }
}
