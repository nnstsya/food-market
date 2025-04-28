import { blogData } from '@core/mocks/blogs';
import { Blog } from '@core/models/blog.model';
import { Review } from '@core/models/review.model';
import { reviewData } from '@core/mocks/reviews';
import { Category, CategoryItem, Subcategory } from '@core/models/category.model';
import { Product, Response } from '@core/models/product.model';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { categoryData, popularCategoryData } from '@core/mocks/categories';
import { ProductsService } from '@home/services/products.service';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  blogs: Blog[] = blogData;
  sortedBlogs: Blog[] = [];
  reviews: Review[] = reviewData;
  categories: CategoryItem[] = categoryData.slice(2, 7);
  popularProductsCategories: CategoryItem[] = popularCategoryData;
  bestSellingProductsCategories: CategoryItem[] = categoryData.slice(0, 5);
  popularProducts: Product[] = [];
  bestSellingProducts: Product[] = [];

  private productsService: ProductsService = inject(ProductsService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getSortedBlogs();

    this.productsService.getProducts().pipe(
      map((res: Response) => {
        this.popularProducts = this.getThreeRandomProducts(res.results);
        this.bestSellingProducts = this.getThreeRandomProducts(res.results);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getThreeRandomProducts(products: Product[]): Product[] {
    const shuffledProducts: Product[] = products.sort(() => 0.5 - Math.random());

    return shuffledProducts.slice(0, 3);
  }

  getSortedBlogs() {
    this.sortedBlogs = this.blogs.sort((blog1, blog2) => {
      const date1 = new Date(blog1.date.split('.').reverse().join('-'));
      const date2 = new Date(blog2.date.split('.').reverse().join('-'));

      return date2.getTime() - date1.getTime();
    });
  }

  getCategoryUrl(title: string): string {
    const categoryKey = title.split(' ').join('').toUpperCase() as keyof typeof Category;
    return `/homepage/${categoryKey.toLowerCase()}`;
  }

  getSubcategoryUrl(title: string): string {
    const subcategoryKey = title.split(' ').join('').toUpperCase() as keyof typeof Subcategory;
    return `/homepage/${subcategoryKey.toLowerCase()}`;
  }
}
