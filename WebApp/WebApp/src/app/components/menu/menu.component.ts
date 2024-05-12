import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyServiceService } from '../../my-service.service';

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
  mainDishRec: any;
  beverageRec: any;
  dessertRec: any;
  showRecommendationContent: boolean = false;

  url: any;
  baseUrl: any;

  
  constructor(private myService: MyServiceService, private http: HttpClient) {
    this.baseUrl = this.myService.getData();
    
    this.url = this.baseUrl + '/api/Sentiment/';
    console.log('Current URL:', this.url);
  }
  
  getMenu(){
    try {
      const apiUrl = this.url;
        this.http.get<any>(apiUrl).subscribe(
          (response) => {
            console.log(response);
            this.mainDishMenu = response.texto;
            this.beverageMenu = response.texto;
            this.dessertMenu = response.texto;

          },
          (error) => {
            console.error('Error:', error);
          }
        )
    } catch (error) {
      // Log the error (you can remove this line if not needed)
      console.error('Fetch error:', error);
      // Propagate the error by rethrowing it
      throw error;
    }
  }


  getPlatillos() {
    this.http.get<any>(this.url + '/platilloPrincipal').subscribe(
      (response) => {
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
        this.dessertMenu = response.map(
          (dessert: { name: any }) => dessert.name
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getMenuRecommendation(){
    this.showRecommendationContent = true;
    const apiUrl = this.url + `?platilloPrincipal=${this.selectedPlatillo}&bebida=${this.selectedBebida}&postre =${this.selectedPostre}`;
    try {
        this.http.get<any>(apiUrl).subscribe(
          (response) => {
            console.log(response);
            this.mainDishRec = response.platilloRecommendation;
            this.beverageRec = response.bebidaRecommendation;
            this.dessertRec = response.postreRecommendation;
          },
          (error) => {
            console.error('Error:', error);
          }
        )
    } catch (error) {
      // Log the error (you can remove this line if not needed)
      console.error('Fetch error:', error);
      // Propagate the error by rethrowing it
      throw error;
    }
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
    this.showRecommendationContent = false;
  }

  
}
