import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class MenuComponent implements OnInit {
  mainDishMenu: any;
  beverageMenu: any;
  dessertMenu: any;
  selectedPostre: string = ''; // Provide an initial value
  selectedPlatillo: string = '';
  selectedBebida: string = '';

  url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPlatillos() {
    this.http.get<any>(this.url + '/platilloPrincipal').subscribe(
      (response) => {
        console.log('Response:', response);
        this.mainDishMenu = response.map(
          (platilloPrincipal: { name: any }) => platilloPrincipal.name
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getBeverages() {
    this.http.get<any>(this.url + '/bebida').subscribe(
      (response) => {
        console.log('Response:', response);
        this.beverageMenu = response.map(
          (beverage: { name: any }) => beverage.name
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getPostres() {
    this.http.get<any>(this.url + '/postre').subscribe(
      (response) => {
        console.log('Response:', response);
        this.dessertMenu = response.map(
          (dessert: { name: any }) => dessert.name
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  async ngOnInit() {
    this.getPlatillos();
    this.getBeverages();
    this.getPostres();
  }

  clearSelections() {
    this.selectedPostre = '';
    this.selectedPlatillo = '';
    this.selectedBebida = '';
  }
}
