import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from "@shared/shared.module";
import { blogData } from "@core/mocks/blogs";
import { BlogsComponent } from "@home/blogs/blogs.component";
import { ActivatedRoute, RouterModule } from "@angular/router";

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogsComponent],
      imports: [SharedModule, RouterModule],
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

    expect(component.allDisplayedBlogs[0].date).toBe('04.06.2025');
  });

  it('should separate main blogs and remaining blogs correctly', () => {
    component.blogs = blogData;
    component.getSortedBlogs();

    expect(component.mainBlogs.length).toBe(2);
    expect(component.allDisplayedBlogs.length).toBe(blogData.length - 2);
  });

  it('should update displayed blogs based on current pages', () => {
    component.blogs = blogData;
    component.getSortedBlogs();
    component.onSelectedPagesChange([1, 2]);

    expect(component.displayedBlogs.length).toBeLessThanOrEqual(component.blogsPerPage * 2);
    expect(component.currentPages).toEqual([1, 2]);
  });

  it('should save current pages to localStorage', () => {
    const pages = [1, 2];
    component.onSelectedPagesChange(pages);

    const storedPages = JSON.parse(localStorage.getItem('currentPages') || '[]');
    expect(storedPages).toEqual(pages);
  });

  it('should clear localStorage on component destroy', () => {
    localStorage.setItem('currentPages', '[1,2]');
    component.ngOnDestroy();

    expect(localStorage.getItem('currentPages')).toBeNull();
  });

  it('should initialize with correct total quantity', () => {
    component.blogs = blogData;
    component.ngOnInit();

    expect(component.totalQuantity).toBe(blogData.length - 2);
  });
});

