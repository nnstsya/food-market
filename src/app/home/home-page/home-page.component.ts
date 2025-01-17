import { Component } from '@angular/core';
import { popularProductsData, productsData } from '@core/mocks/products';
import { Product, ProductItem } from '@core/models/product.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  popularProducts: Product[] = productsData.slice(3, 6);
  popularProductsCategories: ProductItem[] = popularProductsData;
}
