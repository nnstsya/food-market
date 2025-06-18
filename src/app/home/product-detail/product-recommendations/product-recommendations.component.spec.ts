import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRecommendationsComponent } from './product-recommendations.component';
import { ProductsService } from '@home/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from "@shared/shared.module";
import { mockProducts } from "@core/mocks/products";

describe('ProductRecommendationsComponent', () => {
  let component: ProductRecommendationsComponent;
  let fixture: ComponentFixture<ProductRecommendationsComponent>;
  let productsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const productsServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({ results: mockProducts }))
    };

    await TestBed.configureTestingModule({
      declarations: [ProductRecommendationsComponent],
      imports: [SharedModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: () => '1'
            })
          }
        }
      ]
    }).compileComponents();

    productsService = TestBed.inject(ProductsService) as jest.Mocked<ProductsService>;
    fixture = TestBed.createComponent(ProductRecommendationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load 4 recommended products excluding current product', (done) => {
    fixture.detectChanges();

    component.recommendedProducts$.subscribe(products => {
      expect(products.length).toBe(4);
      expect(products.some(p => p.id === '1')).toBeFalsy();
      done();
    });
  });

  it('should call products service on init', () => {
    fixture.detectChanges();
    expect(productsService.getProducts).toHaveBeenCalled();
  });
});
