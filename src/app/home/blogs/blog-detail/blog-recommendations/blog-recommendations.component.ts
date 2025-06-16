import { Component, inject, OnInit } from '@angular/core';
import { Blog } from "@core/models/blog.model";
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { blogData } from "@core/mocks/blogs";

@Component({
  selector: 'app-blog-recommendations',
  templateUrl: './blog-recommendations.component.html',
  styleUrl: './blog-recommendations.component.scss'
})
export class BlogRecommendationsComponent implements OnInit {
  recommendedBlogs$: Observable<Blog[]> = of([]);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const currentBlogId = this.route.snapshot.paramMap.get('id');
    this.recommendedBlogs$ = of(this.loadRecommendations(currentBlogId));
  }

  private loadRecommendations(currentBlogId: string | null): Blog[] {
    const filteredBlogs = blogData.filter(blog => blog.id !== parseInt(currentBlogId!));
    return this.getRandomBlogs(filteredBlogs, 4);
  }

  private getRandomBlogs(blogs: Blog[], count: number): Blog[] {
    return blogs
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }
}
