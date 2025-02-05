import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CategoryItem } from '@core/models/category.model';
import { categoryData, popularCategoryData } from '@core/mocks/categories';
import { Product } from '@core/models/product.model';
import { ProductsService } from '@home/services/products.service';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { blogData } from '@core/mocks/blogs';
import { Blog } from '@core/models/blog.model';
import { Review } from '@core/models/review.model';
import { reviewData } from '@core/mocks/reviews';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  popularProductsCategories: string[] = popularCategoryData;
  bestSellingProductsCategories: CategoryItem[] = categoryData.slice(0, 5)
  popularProducts: Product[] = [];
  bestSellingProducts: Product[] = [];
  blogs: Blog[] = blogData;
  sortedBlogs: Blog[] = [];
  reviews: Review[] = reviewData;

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

    this.getSortedBlogs();
  }

  getSortedBlogs() {
    this.sortedBlogs = this.blogs.sort((blog1, blog2) => {
      const date1 = new Date(blog1.date.split('.').reverse().join('-'));
      const date2 = new Date(blog2.date.split('.').reverse().join('-'));

      return date2.getTime() - date1.getTime();
    });
  }

  getThreeRandomProducts(products: Product[]): Product[] {
    const shuffledProducts: Product[] = products.sort(() => 0.5 - Math.random());

    return shuffledProducts.slice(0, 3);
  }
}
