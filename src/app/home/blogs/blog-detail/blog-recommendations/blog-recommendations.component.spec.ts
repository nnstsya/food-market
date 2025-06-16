import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogRecommendationsComponent } from './blog-recommendations.component';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from "@shared/shared.module";

describe('BlogRecommendationsComponent', () => {
  let component: BlogRecommendationsComponent;
  let fixture: ComponentFixture<BlogRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogRecommendationsComponent],
      imports: [SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogRecommendationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load 4 recommended blogs excluding current blog', (done) => {
    fixture.detectChanges();

    component.recommendedBlogs$.subscribe(blogs => {
      expect(blogs.length).toBe(4);
      expect(blogs.some(b => b.id === 1)).toBeFalsy();
      done();
    });
  });

  it('should filter out current blog from recommendations', (done) => {
    fixture.detectChanges();

    component.recommendedBlogs$.subscribe(blogs => {
      const currentBlogId = 1;
      expect(blogs.find(blog => blog.id === currentBlogId)).toBeUndefined();
      done();
    });
  });
});
