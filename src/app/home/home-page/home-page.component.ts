import { Component } from '@angular/core';
import { Category } from '@core/models/category.model';
import { categoryData } from '@core/mocks/categories';
import { Product } from '@core/models/product.model';
import { productsData } from '@core/mocks/products';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  bestSellingProducts: Category[] = categoryData.slice(0, 5)
  products: Product[] = productsData.slice(0, 3);
}
