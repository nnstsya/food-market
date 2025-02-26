import { Component, OnInit } from '@angular/core';
import { blogData } from '@core/mocks/blogs';
import { Blog } from '@core/models/blog.model';
import { Review } from '@core/models/review.model';
import { reviewData } from '@core/mocks/reviews';
import { Category, CategoryItem } from '@core/models/category.model';
import { categoriesData } from '@core/mocks/categories';

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
  categories: CategoryItem[] = this.allCategories.slice(0, 5).map((category: Category): CategoryItem => ({
    id: category,
    title: categoriesData[category],
  }));

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
