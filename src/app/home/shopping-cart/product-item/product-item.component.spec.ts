import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductItemComponent } from './product-item.component';
import { ProductsService } from '@home/services/products.service';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ModalService } from '@shared/components/modal/modal.service';
import { ProductCart } from '@core/models/product.model';
import { SharedModule } from "@shared/shared.module";
import { NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { mockProducts } from "@core/mocks/products";
import { of } from 'rxjs';

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;
  let productsService: jest.Mocked<ProductsService>;
  let shoppingCartService: jest.Mocked<ShoppingCartService>;
  let router: jest.Mocked<Router>;
  let modalService: jest.Mocked<ModalService>;

  const mockProduct: ProductCart = {
    product: mockProducts[0],
    quantity: 1
  };

  const mockProductsService = {
    addToWishList: jest.fn().mockReturnValue(of({})),
    removeFromWishList: jest.fn().mockReturnValue(of({})),
    getWishList: jest.fn().mockReturnValue(of({ results: [], totalItems: 0 }))
  };

  const mockShoppingCartService = {
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockModalService = {
    hideModal: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductItemComponent],
      imports: [SharedModule, NgOptimizedImage, FormsModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ShoppingCartService, useValue: mockShoppingCartService },
        { provide: Router, useValue: mockRouter },
        { provide: ModalService, useValue: mockModalService }
      ]
    }).compileComponents();

    productsService = TestBed.inject(ProductsService) as jest.Mocked<ProductsService>;
    shoppingCartService = TestBed.inject(ShoppingCartService) as jest.Mocked<ShoppingCartService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getRatingArray', () => {
    it('should return correct rating array', () => {
      const result = component.getRatingArray();
      expect(result).toEqual([1, 1, 1, 0, 0]);
    });
  });

  describe('onImageError', () => {
    it('should set placeholder image on error', () => {
      const mockEvent = {
        target: { src: 'original.jpg' }
      } as unknown as Event;

      component.onImageError(mockEvent);
      expect((mockEvent.target as HTMLImageElement).src).toContain('image-placeholder.jpg');
    });
  });

  describe('wishlist operations', () => {
    it('should add product to wishlist', () => {
      component.addToWishList(mockProduct.product);
      expect(productsService.addToWishList).toHaveBeenCalledWith(mockProduct.product.id);
    });

    it('should remove product from wishlist', () => {
      component.removeFromWishList(mockProduct.product);
      expect(productsService.removeFromWishList).toHaveBeenCalledWith(mockProduct.product.id);
    });

    it('should check if product is in wishlist', (done) => {
      productsService.getWishList.mockReturnValue(of({ results: [mockProduct.product], totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 5 }));

      component.checkIfInWishList(mockProduct.product).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  describe('cart operations', () => {
    it('should remove product from cart', () => {
      component.removeFromCart();
      expect(shoppingCartService.removeFromCart).toHaveBeenCalledWith(mockProduct.product.id);
    });

    it('should update quantity within limits', () => {
      const mockEvent = {
        target: { value: '5' }
      } as unknown as Event;

      component.onQuantityChange(mockEvent);
      expect(shoppingCartService.updateQuantity).toHaveBeenCalledWith(
        mockProduct.product.id,
        5,
        mockProduct.product.maxKgs
      );
    });

    it('should limit quantity to maxKgs', () => {
      const mockEvent = {
        target: { value: '15' }
      } as unknown as Event;

      component.onQuantityChange(mockEvent);
      expect(shoppingCartService.updateQuantity).toHaveBeenCalledWith(
        mockProduct.product.id,
        mockProduct.product.maxKgs,
        mockProduct.product.maxKgs
      );
    });
  });

  describe('navigation', () => {
    it('should navigate to product detail', () => {
      component.navigateToProductDetail(mockProduct.product);

      expect(router.navigate).toHaveBeenCalledWith(
        ['homepage', 'fruitandvegetables', 'apple'],
        { queryParams: { id: mockProduct.product.id } }
      );
      expect(modalService.hideModal).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    it('should format category name correctly', () => {
      const mockProduct = { ...component.product().product };
      mockProduct.category = 'Fruit And Vegetables';
      fixture.componentRef.setInput('product', { product: mockProduct, quantity: 1 });

      component.navigateToProductDetail(mockProduct);
      expect(router.navigate).toHaveBeenCalledWith(
        ['homepage', 'fruit-and-vegetables', expect.any(String)],
        expect.any(Object)
      );
    });

    it('should update buyByOptions based on product buyBy', () => {
      fixture.componentRef.setInput('product', {
        product: mockProduct.product,
        quantity: 1
      });

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.buyByOptions.length).toBeGreaterThan(0);
      expect(component.buyByOptions.some(opt => opt.title === 'kgs')).toBeTruthy();
      expect(component.buyByOptions.some(opt => opt.title === 'pcs')).toBeTruthy();
    });
  });
});

