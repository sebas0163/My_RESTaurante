import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import defaultResponses from './defaultResponses.json';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../../app.component.scss']
})
export class MenuComponent implements OnInit {
  menuItems: any;
  selectedPostre: string = ''; // Provide an initial value
  selectedPlatillo: string = '';
  selectedBebida: string = '';

  constructor() { }

  ngOnInit() {
    this.menuItems = defaultResponses;
  }

  toggleSelection(category: string, item: string) {
    switch (category) {
      case 'postre':
        this.selectedPostre = this.selectedPostre === item ? '' : item;
        break;
      case 'platillo':
        this.selectedPlatillo = this.selectedPlatillo === item ? '' : item;
        break;
      case 'bebida':
        this.selectedBebida = this.selectedBebida === item ? '' : item;
        break;
    }
  }
  clearSelections() {
    this.selectedPostre = '';
    this.selectedPlatillo = '';
    this.selectedBebida = '';
  }
}
