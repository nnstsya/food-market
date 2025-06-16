import { Component, OnDestroy, OnInit } from '@angular/core';
import { Blog } from "@core/models/blog.model";
import { blogData } from "@core/mocks/blogs";

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

  ngOnInit() {
    this.getSortedBlogs();
    this.totalQuantity = this.allDisplayedBlogs.length;
  }

  ngOnDestroy() {
    localStorage.removeItem('currentPages');
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

  private updateDisplayedBlogs(): void {
    this.displayedBlogs = this.currentPages.reduce((acc: Blog[], page: number): Blog[] => {
      const startIndex: number = (page - 1) * this.blogsPerPage;
      const endIndex: number = startIndex + this.blogsPerPage;
      return acc.concat(this.allDisplayedBlogs.slice(startIndex, endIndex));
    }, []);
  }
}
