import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Category } from '@core/models/category.model';
import { categoryData, popularCategoryData } from '@core/mocks/categories';
import { Product } from '@core/models/product.model';
import { ProductsService } from '@home/services/products.service';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  popularProductsCategories: string[] = popularCategoryData;
  bestSellingProductsCategories: Category[] = categoryData.slice(0, 5)
  popularProducts: Product[] | null[] = [null, null, null];
  bestSellingProducts: Product[] | null[] = [null, null, null];

  private productsService: ProductsService = inject(ProductsService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit() {
    this.productsService.getProducts().pipe(
      map((res: Product[]) => {
        this.popularProducts = this.getThreeRandomProducts(res);
        this.bestSellingProducts = this.getThreeRandomProducts(res);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getThreeRandomProducts(products: Product[]): Product[] {
    const shuffledProducts: Product[] = products.sort(() => 0.5 - Math.random());

    return shuffledProducts.slice(0, 3);
  }
}
