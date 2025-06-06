import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from "@shared/shared.module";
import { blogData } from "@core/mocks/blogs";
import { BlogsComponent } from "@home/blogs/blogs.component";
import { BlogFilterService } from '../services/blog-filter.service';

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;
  let blogFilterService: BlogFilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogsComponent],
      imports: [SharedModule],
      providers: [BlogFilterService]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogsComponent);
    component = fixture.componentInstance;
    blogFilterService = TestBed.inject(BlogFilterService);
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort blogs by date in descending order', () => {
    component.blogs = blogData;
    component.getSortedBlogs();
    expect(component.allDisplayedBlogs[0].date).toBe('17.6.2020');
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

  it('should handle filter selection', () => {
    component.blogs = blogData;
    component.ngOnInit();
    component.onFilterSelect('category', 0);
    expect(component.currentPages).toEqual([1]);
  });

  it('should handle back navigation', () => {
    component.blogs = blogData;
    component.ngOnInit();
    component.onFilterSelect('category', 0);
    component.onBackClick();
    expect(component.currentPages).toEqual([1]);
  });

  it('should update total quantity after filtering', () => {
    component.blogs = blogData;
    component.ngOnInit();
    component.onFilterSelect('category', 0);
    expect(component.totalQuantity).toBeLessThan(blogData.length);
  });

  it('should handle filter state on initialization', () => {
    const mockState = {
      dates: [],
      categories: [],
      filterHistory: [{ type: 'category', id: 0 }]
    };
    localStorage.setItem('blogFilterState', JSON.stringify(mockState));
    component.ngOnInit();
    expect(component.hasActiveFilters()).toBe(true);
  });

  it('should update filtered blogs when filter is selected', () => {
    component.blogs = blogData;
    component.ngOnInit();
    const initialCount = component.displayedBlogs.length;
    component.onFilterSelect('category', 0);
    expect(component.displayedBlogs.length).not.toEqual(initialCount);
  });

  it('should update filtered blogs on back navigation', () => {
    component.blogs = blogData;
    component.ngOnInit();
    component.onFilterSelect('category', 0);
    const filteredCount = component.displayedBlogs.length;
    component.onBackClick();
    expect(component.displayedBlogs.length).not.toEqual(filteredCount);
  });

  it('should maintain correct page state during filter changes', () => {
    component.blogs = blogData;
    component.ngOnInit();
    component.onSelectedPagesChange([2, 3]);
    component.onFilterSelect('category', 0);
    expect(component.currentPages).toEqual([1]);
  });

  it('should parse dates correctly when sorting', () => {
    component.blogs = [
      { ...blogData[0], date: '01.1.2020' },
      { ...blogData[1], date: '02.1.2020' }
    ];
    component.getSortedBlogs();
    expect(component.mainBlogs[0].date).toBe('02.1.2020');
  });
});
