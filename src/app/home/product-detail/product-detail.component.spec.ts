import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductsService } from '@home/services/products.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { mockProducts} from "@core/mocks/products";
import { SharedModule } from "@shared/shared.module";
import {
  ProductRecommendationsComponent
} from "@home/product-detail/product-recommendations/product-recommendations.component";
import { FormsModule } from "@angular/forms";
import { NgOptimizedImage } from "@angular/common";

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productsService: jest.Mocked<ProductsService>;
  let shoppingCartService: jest.Mocked<ShoppingCartService>;

  beforeEach(async () => {
    const productsServiceMock = {
      getProductById: jest.fn().mockReturnValue(of(mockProducts[0])),
      getWishList: jest.fn().mockReturnValue(of({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
        results: []
      })),
      addToWishList: jest.fn().mockReturnValue(of({})),
      removeFromWishList: jest.fn().mockReturnValue(of({}))
    };

    const shoppingCartServiceMock = {
      addToCart: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent, ProductRecommendationsComponent],
      imports: [SharedModule, RouterLink, FormsModule, NgOptimizedImage],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ShoppingCartService, useValue: shoppingCartServiceMock },
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
    shoppingCartService = TestBed.inject(ShoppingCartService) as jest.Mocked<ShoppingCartService>;
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    expect(productsService.getProductById).toHaveBeenCalledWith('1');
    expect(component.product).toEqual(mockProducts[0]);
  });

  it('should format freshness correctly', () => {
    component.product = mockProducts[0];
    expect(component.freshness).toBe('2 days old');
  });

  it('should format delivery days correctly', () => {
    component.product = mockProducts[0];
    expect(component.deliveryDays).toBe('In 1 day');
  });

  it('should add product to cart', () => {
    component.product = mockProducts[0];
    component.quantity = 2;
    component.addToCart();
    expect(shoppingCartService.addToCart).toHaveBeenCalledWith(mockProducts[0], 2);
  });

  it('should handle image error', () => {
    const event = {
      target: {
        src: 'original-src'
      }
    } as unknown as Event;

    component.onImageError(event);
    expect((event.target as HTMLImageElement).src).toBe('assets/images/image-placeholder.jpg');
  })

  it('should get rating array correctly', () => {
    const rate = 3.5;
    const expectedArray = [1, 1, 1, 1, 1].fill(0, Math.round(rate), 5);
    expect(component.getRatingArray(rate)).toEqual(expectedArray);
  });

  describe('wishlist', () => {
    it('should toggle wishlist status', () => {
      component.product = mockProducts[0];

      component.addToWishList(mockProducts[0]);
      expect(productsService.addToWishList).toHaveBeenCalledWith(mockProducts[0].id);
      expect(component.isInWishlist).toBe(true);

      component.removeFromWishList(mockProducts[0]);
      expect(productsService.removeFromWishList).toHaveBeenCalledWith(mockProducts[0].id);
      expect(component.isInWishlist).toBe(false);
    });

    it('should check if product is in wishlist', () => {
      component.product = mockProducts[0];
      productsService.getWishList.mockReturnValue(of({
        results: [mockProducts[0]],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
      }));

      component.checkIfInWishList(mockProducts[0]).subscribe(isInWishlist => {
        expect(isInWishlist).toBe(true);
      });
    });

    it('should handle wishlist check when product is not in wishlist', () => {
      component.product = mockProducts[0];
      productsService.getWishList.mockReturnValue(of({
        results: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10
      }));

      component.checkIfInWishList(mockProducts[0]).subscribe(isInWishlist => {
        expect(isInWishlist).toBe(false);
      });
    });
  });

  describe('category formatting', () => {
    it('should format category correctly', () => {
      expect(component.getFormattedCategory('FRUITANDVEGETABLES')).toBe('Fruit and vegetables');
      expect(component.getFormattedCategory('')).toBe('');
      expect(component.getFormattedCategory('INVALID')).toBe('');
    });

    it('should format URL category name correctly', () => {
      expect(component.getUrlCategoryName('FRUITANDVEGETABLES')).toBe('fruitandvegetables');
      expect(component.getUrlCategoryName('')).toBe('');
    });
  });

  describe('stock formatting', () => {
    it('should format stock correctly', () => {
      expect(component.getFormattedStock('INSTOCK')).toBe('In Stock');
      expect(component.getFormattedStock('EXPECTEDSOON')).toBe('Expected Soon');
    });
  });

  describe('buy options formatting', () => {
    it('should format buy options correctly', () => {
      component.buyByOptions = [
        { id: 1, title: 'kgs' },
        { id: 2, title: 'pcs' },
        { id: 3, title: 'kgs' }
      ];
      expect(component.getFormattedBuyOptions()).toBe('pcs, kgs');
    });

    it('should handle empty buy options', () => {
      component.buyByOptions = [];
      expect(component.getFormattedBuyOptions()).toBe('');
    });

    it('should update buy options when product changes', () => {
      component.product = {
        ...mockProducts[0],
        buyBy: ['Weight', 'Piece']
      };
      component['updateBuyByOptions']();
      expect(component.buyByOptions.map(opt => opt.title)).toEqual(['kgs', 'pcs']);
    });

    it('should handle null or undefined buy option titles', () => {
      component.buyByOptions = [
        { id: 1, title: 'kgs' },
        { id: 2, title: undefined! },
        { id: 3, title: null! }
      ];
      expect(component.getFormattedBuyOptions()).toBe('kgs, ');
    });
  });

  describe('freshness display', () => {
    it('should handle singular case for freshness', () => {
      component.product = { ...mockProducts[0], freshness: 1 };
      expect(component.freshness).toBe('1 day old');
    });

    it('should handle plural case for freshness', () => {
      component.product = { ...mockProducts[0], freshness: 3 };
      expect(component.freshness).toBe('3 days old');
    });
  });

  describe('delivery days display', () => {
    it('should show Today for 0 days', () => {
      component.product = { ...mockProducts[0], deliveryDays: 0 };
      expect(component.deliveryDays).toBe('Today');
    });

    it('should handle singular case for delivery days', () => {
      component.product = { ...mockProducts[0], deliveryDays: 1 };
      expect(component.deliveryDays).toBe('In 1 day');
    });

    it('should handle plural case for delivery days', () => {
      component.product = { ...mockProducts[0], deliveryDays: 3 };
      expect(component.deliveryDays).toBe('In 3 days');
    });
  });

  describe('URL category formatting', () => {
    it('should format multi-word category names correctly', () => {
      expect(component.getUrlCategoryName('FRUITANDVEGETABLES')).toBe('fruitandvegetables');
    });

    it('should return empty string for invalid category', () => {
      expect(component.getUrlCategoryName('INVALID_CATEGORY')).toBe('');
    });
  });

  describe('authentication', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should check authentication status on init', () => {
      localStorage.setItem('user', 'test-user');

      fixture = TestBed.createComponent(ProductDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isAuthenticated).toBe(true);

      localStorage.clear();
      fixture = TestBed.createComponent(ProductDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isAuthenticated).toBe(false);
    });
  });
});
