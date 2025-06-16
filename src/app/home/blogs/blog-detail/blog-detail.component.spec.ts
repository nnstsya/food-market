import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location, NgOptimizedImage } from '@angular/common';
import { BlogDetailComponent } from './blog-detail.component';
import { blogData } from "@core/mocks/blogs";
import { SharedModule } from "@shared/shared.module";
import { CommentsComponent } from "@home/blogs/blog-detail/comments/comments.component";

describe('BlogDetailComponent', () => {
  let component: BlogDetailComponent;
  let fixture: ComponentFixture<BlogDetailComponent>;
  let mockRouter: Router;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      declarations: [BlogDetailComponent, CommentsComponent],
      imports: [
        SharedModule,
        NgOptimizedImage,
        RouterModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blog based on route param', () => {
    component.ngOnInit();
    expect(component.blog).toEqual(blogData[0]);
  });

  it('should navigate to blogs list if blog is not found', () => {
    jest.spyOn(component['route'].snapshot.paramMap, 'get').mockReturnValue('999');
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs']);
  });

  it('should navigate to blogs list if no blog id is provided', () => {
    jest.spyOn(component['route'].snapshot.paramMap, 'get').mockReturnValue(null);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs']);
  });

  it('should navigate back to blog list on back button click', () => {
    component.onBackToBlogList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blogs']);
  });
});
