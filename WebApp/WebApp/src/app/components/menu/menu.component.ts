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
  dishRec1: any;
  dishRec2: any;
  showRecommendationContent: boolean = false;
  is_two_values: boolean = false;
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

  getOptions(){
    let body = {};
    if (this.selectedPostre.trim() !== '' && this.selectedPlatillo.trim() !== ''){
      this.dishRec1 = this.selectedPostre;
      this.dishRec2 = this.selectedPlatillo;
    } 
    if (this.selectedPostre.trim() !== '' && this.selectedBebida.trim() !== ''){
      this.dishRec1 = this.selectedPostre;
      this.dishRec2 = this.selectedBebida;
    } 
    if (this.selectedBebida.trim() !== '' && this.selectedPlatillo.trim() !== ''){
      this.dishRec1 = this.selectedBebida;
      this.dishRec2 = this.selectedPlatillo;
    } 
      body = {
        dish1: this.dishRec1,
        dish2: this.dishRec2
      };

    return body
  }



  postMenuRecommendation(){
    const body = this.getOptions();
    let isBodyEmpty =  Object.keys(body).length === 0;

    if(!isBodyEmpty){
      this.is_two_values = true;
      try {
        this.http.post<any>(this.menuRecUrl, body).subscribe(
            (response) => {
              let selectedResponses: any[] = [];
              response.forEach((item: { type: string; name: any; }) => {
                selectedResponses.push(item.name);
                this.showRecommendationContent = true;
  
              });
              this.dishRec1 = selectedResponses[0];
              this.dishRec2 = selectedResponses[1];
              
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
    else{
      this.is_two_values = false;
      console.log("No hay valores");
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
