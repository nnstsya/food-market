import { Component, OnInit } from '@angular/core';
import { Blog } from "@core/models/blog.model";
import { blogData } from "@core/mocks/blogs";

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = blogData;
  sortedBlogs: Blog[] = [];

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
