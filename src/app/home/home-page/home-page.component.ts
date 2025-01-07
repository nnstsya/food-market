import { Component } from '@angular/core';
import { Category } from '@core/models/category.model';
import { categoryData } from '@core/mocks/categories';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  categories: Category[] = categoryData.slice(0, 5)
}
