import { Component } from '@angular/core';
import { Category, CategoryItem } from '@core/models/category.model';
import { categoriesData } from '@core/mocks/categories';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  allCategories: Category[] = Object.values(Category);

  categories: CategoryItem[] = this.allCategories.slice(0, 5).map((category: Category): CategoryItem => ({
    id: category,
    title: categoriesData[category],
  }));
}
