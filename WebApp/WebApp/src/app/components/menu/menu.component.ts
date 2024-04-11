import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyServiceService } from '../../my-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class MenuComponent implements OnInit {
  mainDishMenu: any = [];
  beverageMenu: any = [];
  dessertMenu: any = [];
  selectedPostre: string = ''; // Provide an initial value
  selectedPlatillo: string = '';
  selectedBebida: string = '';
  mainDishRec: any;
  beverageRec: any;
  dessertRec: any;
  showRecommendationContent: boolean = false;

  menuUrl: any;
  menuRecUrl: any;

  
  constructor(private myService: MyServiceService, private http: HttpClient) {
    this.menuUrl = this.myService.getMenuUrl();
    this.menuRecUrl = this.myService.getMenuRecUrl();
  }
  
  getMenu(){
    try {
        this.http.get<any>(this.menuUrl).subscribe(
          (response) => {
            
            response.forEach((item: { type: string; name: any; }) => {
              if (item.type.trim().toLowerCase() === 'main plate') {
                this.mainDishMenu.push(item.name);
              } else if (item.type.trim().toLowerCase() === 'drink') {
                this.beverageMenu.push(item.name);
              } else if (item.type.trim().toLowerCase() === 'dessert') {
                this.dessertMenu.push(item.name);
              }

            });

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


  /*
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
  */

  getMenuRecommendation(){
    this.showRecommendationContent = true;
    const apiUrl = this.menuRecUrl + `?platilloPrincipal=${this.selectedPlatillo}&bebida=${this.selectedBebida}&postre =${this.selectedPostre}`;
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
    this.getMenu();
  }

  clearSelections() {
    this.selectedPostre = '';
    this.selectedPlatillo = '';
    this.selectedBebida = '';
    this.showRecommendationContent = false;
  }

  
}
