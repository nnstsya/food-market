import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from "@core/models/blog.model";
import { blogData } from "@core/mocks/blogs";

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  blog!: Blog;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.loadBlog();
  }

  private loadBlog(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      const foundBlog = blogData.find(blog => blog.id === parseInt(blogId));
      if (foundBlog) {
        this.blog = foundBlog;
      } else {
        this.router.navigate(['/blogs']);
      }
    } else {
      this.router.navigate(['/blogs']);
    }
  }

  onBackToBlogList(): void {
    this.router.navigate(['/blogs']);
  }
}
