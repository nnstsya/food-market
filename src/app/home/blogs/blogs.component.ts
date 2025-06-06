import { Component, OnDestroy, OnInit, computed, Signal, inject } from '@angular/core';
import { Blog } from "@core/models/blog.model";
import { blogData } from "@core/mocks/blogs";
import { BlogFilterService, BlogFilterState } from '../services/blog-filter.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit, OnDestroy {
  blogs: Blog[] = blogData;
  mainBlogs: Blog[] = [];
  displayedBlogs: Blog[] = [];
  totalQuantity: number = 0;
  currentPages: number[] = JSON.parse(localStorage.getItem('currentPages') || '[1]');
  blogsPerPage: number = 5;
  allDisplayedBlogs: Blog[] = [];

  filterState: Signal<BlogFilterState> = computed(() => this.blogFilterService.getState()());
  hasActiveFilters: Signal<boolean> = computed(() => this.filterState().filterHistory.length > 0);
  filterDescription: Signal<string> = computed(() => this.blogFilterService.getCurrentFilterDescription());

  private blogFilterService: BlogFilterService = inject(BlogFilterService);

  ngOnInit() {
    this.blogFilterService.initializeFilters(this.blogs);
    this.getSortedBlogs();

    if (this.hasActiveFilters()) {
      this.updateFilteredBlogs();
    } else {
      this.updateTotalQuantity();
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('currentPages');
    localStorage.removeItem('blogFilterState');
  }

  getSortedBlogs() {
    const sortedBlogs: Blog[] = this.blogs.sort((blog1, blog2) => {
      const date1 = new Date(blog1.date.split('.').reverse().join('-'));
      const date2 = new Date(blog2.date.split('.').reverse().join('-'));
      return date2.getTime() - date1.getTime();
    });

    this.mainBlogs = sortedBlogs.slice(0, 2);
    this.allDisplayedBlogs = sortedBlogs.slice(2);
    this.updateDisplayedBlogs();
  }

  onSelectedPagesChange(pages: number[]): void {
    this.currentPages = pages;
    localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
    this.updateDisplayedBlogs();
  }

  onFilterSelect(type: 'date' | 'category', id: number): void {
    this.blogFilterService.toggleFilter(type, id);
    this.updateFilteredBlogs();
  }

  onBackClick(): void {
    this.blogFilterService.goBack();
    this.updateFilteredBlogs();
  }

  private updateDisplayedBlogs(): void {
    this.displayedBlogs = this.currentPages.reduce((acc: Blog[], page: number): Blog[] => {
      const startIndex: number = (page - 1) * this.blogsPerPage;
      const endIndex: number = startIndex + this.blogsPerPage;
      return acc.concat(this.allDisplayedBlogs.slice(startIndex, endIndex));
    }, []);
  }

  private updateFilteredBlogs(): void {
    this.allDisplayedBlogs = this.blogFilterService.filterBlogs(this.blogs.slice(2));
    this.currentPages = [1];
    this.updateDisplayedBlogs();
    this.updateTotalQuantity();
  }

  private updateTotalQuantity(): void {
    this.totalQuantity = this.allDisplayedBlogs.length;
  }
}
