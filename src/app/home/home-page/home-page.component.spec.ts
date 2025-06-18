import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ProductsService } from '@home/services/products.service';
import { of } from 'rxjs';
import { SharedModule } from "@shared/shared.module";
import { ReviewsComponent } from "@home/home-page/reviews/reviews.component";
import { ReviewsSliderComponent } from "@home/home-page/reviews-slider/reviews-slider.component";
import { mockProducts } from "@core/mocks/products";
import { blogData } from "@core/mocks/blogs";
import { ActivatedRoute } from "@angular/router";

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let productsServiceMock: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    productsServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({
        results: mockProducts,
        totalItems: mockProducts.length,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
      }))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [HomePageComponent, ReviewsComponent, ReviewsSliderComponent],
      imports: [SharedModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get three random products', () => {
    const result = component.getThreeRandomProducts(mockProducts);
    expect(result.length).toBe(3);
    expect(mockProducts).toContain(result[0]);
  });

  it('should sort blogs by date in descending order', () => {
    component.blogs = blogData;
    component.getSortedBlogs();

    expect(component.sortedBlogs[0].date).toBe('17.6.2020');
  });

  it('should initialize products on ngOnInit', () => {
    component.ngOnInit();

    expect(productsServiceMock.getProducts).toHaveBeenCalled();
    expect(component.popularProducts.length).toBe(3);
    expect(component.bestSellingProducts.length).toBe(3);
  });
});
