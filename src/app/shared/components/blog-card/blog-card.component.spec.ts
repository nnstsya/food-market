import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogCardComponent } from './blog-card.component';
import { Blog } from '@core/models/blog.model';
import { blogData } from "@core/mocks/blogs";

describe('BlogCardComponent', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;

  const mockBlog: Blog = blogData[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render vertical card layout when type is vertical', () => {
    fixture.componentRef.setInput('type', 'vertical');
    fixture.detectChanges();

    const cardElement: HTMLDivElement = fixture.nativeElement.querySelector('.card');
    expect(cardElement).not.toBeNull();

    const imgElement: HTMLImageElement = fixture.nativeElement.querySelector('.card__image');
    expect(imgElement.src).toContain('http://localhost/assets/images/blog_1.jpg');
  });

  it('should render horizontal card layout when type is horizontal', () => {
    fixture.componentRef.setInput('type', 'horizontal');
    fixture.detectChanges();

    const cardElement: HTMLDivElement = fixture.nativeElement.querySelector('.card-horizontal');
    expect(cardElement).not.toBeNull();

    const imgElement: HTMLImageElement = fixture.nativeElement.querySelector('.card-horizontal__image');
    expect(imgElement.src).toContain('http://localhost/assets/images/blog_1.jpg');
  });

  it('should display the blog title, author, and date correctly', () => {
    const titleElement: HTMLParagraphElement = fixture.nativeElement.querySelector('.card__content__body__blog-title');
    expect(titleElement.textContent).toBe(mockBlog.title);

    const authorElements: HTMLParagraphElement[] = fixture.nativeElement.querySelectorAll('.card__content__footer__info');

    expect(authorElements[0].textContent).toBe(mockBlog.author);
    expect(authorElements[1].textContent).toBe(mockBlog.date);
  });
});
