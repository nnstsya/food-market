import { Component, OnInit } from '@angular/core';
import { blogData } from '@core/mocks/blogs';
import { Blog } from '@core/models/blog.model';
import { Review } from '@core/models/review.model';
import { reviewData } from '@core/mocks/reviews';
import { Category, CategoryItem } from '@core/models/category.model';
import { categoriesData } from '@core/mocks/categories';
import { Product, ProductItem } from '@core/models/product.model';
import { popularProductsData,productsData } from '@core/mocks/products';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  blogs: Blog[] = blogData;
  sortedBlogs: Blog[] = [];
  reviews: Review[] = reviewData;
  allCategories: Category[] = Object.values(Category);
  popularProducts: Product[] = productsData.slice(3, 6);
  popularProductsCategories: ProductItem[] = popularProductsData;

  categories: CategoryItem[] = this.allCategories.slice(0, 5).map((category: Category, index: number): CategoryItem => ({
    id: index,
    title: categoriesData[category],
  }));

  bestSellingProducts: CategoryItem[] = this.allCategories.slice(0, 5).map((category: Category, index: number): CategoryItem => ({
    id: index,
    title: categoriesData[category],
  }));

  products: Product[] = productsData.slice(0, 3);

  ngOnInit() {
    this.getSortedBlogs();
  }

  getSortedBlogs() {
    this.sortedBlogs = this.blogs.sort((blog1, blog2) => {
      const date1 = new Date(blog1.date.split('.').reverse().join('-'));
      const date2 = new Date(blog2.date.split('.').reverse().join('-'));

      return date2.getTime() - date1.getTime();
    });
  }
}
