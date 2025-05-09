import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from "@shared/shared.module";
import { blogData } from "@core/mocks/blogs";
import { BlogsComponent } from "@home/blogs/blogs.component";

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogsComponent],
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort blogs by date in descending order', () => {
    component.blogs = blogData;
    component.getSortedBlogs();

    expect(component.sortedBlogs[0].date).toBe('17.6.2020');
  });
});
