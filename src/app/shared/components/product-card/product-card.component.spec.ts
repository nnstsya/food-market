import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Router } from '@angular/router';
import { ProductsService } from '@home/services/products.service';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { Product } from "@core/models/product.model";
import { NgOptimizedImage } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { mockProducts } from "@core/mocks/products";
import { of } from "rxjs";

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockProductsService: jest.Mocked<ProductsService>;
  let mockShoppingCartService: jest.Mocked<ShoppingCartService>;

  const mockProduct: Product = mockProducts[0];

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() } as any;
    mockProductsService = {
      addToWishList: jest.fn().mockReturnValue(of(undefined)),
      removeFromWishList: jest.fn().mockReturnValue(of(undefined)),
      getWishList: jest.fn().mockReturnValue(of({ results: [mockProduct], totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 5 }))
    } as any;
    mockShoppingCartService = {
      addToCart: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [NgOptimizedImage, SharedModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ShoppingCartService, useValue: mockShoppingCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format category name correctly', () => {
    // @ts-expect-error: testing private method
    expect(component.getFormatedCategoryName('FRUIT AND VEGETABLES')).toBe('fruit and vegetables');
    // @ts-expect-error: testing private method
    expect(component.getFormatedCategoryName('Invalid Category')).toBe('invalid category');
  });

  it('should format product name correctly', () => {
    // @ts-expect-error: testing private method
    expect(component.getFormatedProductName('Fresh Apple')).toBe('fresh-apple');
  });

  it('should generate correct rating array', () => {
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    expect(component.getRatingArray()).toEqual([1, 1, 1, 0, 0]);

    fixture.componentRef.setInput('product', { ...mockProduct, rate: undefined });
    fixture.detectChanges();
    expect(component.getRatingArray()).toEqual([0, 0, 0, 0, 0]);

    fixture.componentRef.setInput('product', { ...mockProduct, rate: 0 });
    fixture.detectChanges();
    expect(component.getRatingArray()).toEqual([0, 0, 0, 0, 0]);
  });

  it('should handle image error', () => {
    const mockEvent = {
      target: { src: 'invalid.jpg' }
    } as any;
    component.onImageError(mockEvent);
    expect(mockEvent.target.src).toContain('image-placeholder.jpg');
  });

  it('should determine freshness correctly', () => {
    expect(component.getFreshness(2)).toBe('New (Extra Fresh)');
    expect(component.getFreshness(5)).toBe('Fresh');
    expect(component.getFreshness(15)).toBe('Moderately Fresh');
    expect(component.getFreshness(90)).toBe('Long Lasting Freshness');
    expect(component.getFreshness(200)).toBe('Preserved Freshness');
  });

  it('should add product to wishlist', () => {
    component.addToWishList(mockProduct);
    expect(mockProductsService.addToWishList).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should remove product from wishlist', () => {
    component.removeFromWishList(mockProduct);
    expect(mockProductsService.removeFromWishList).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should navigate to product detail', () => {
    component.navigateToProductDetail();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['homepage', 'fruitandvegetables', 'apple'],
      { queryParams: { id: '1' } }
    );
  });

  it('should add product to cart', () => {
    component.addToCart();
    expect(mockShoppingCartService.addToCart).toHaveBeenCalledWith(mockProduct, 1);
  });
});
