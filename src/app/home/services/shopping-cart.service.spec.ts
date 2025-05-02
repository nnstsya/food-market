import { TestBed } from '@angular/core/testing';
import { ShoppingCartService } from './shopping-cart.service';
import { mockProducts } from '@core/mocks/products';
import { Product } from "@core/models/product.model";

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] ?? null,
        setItem: (key: string, value: string) => localStorageMock[key] = value,
        clear: () => localStorageMock = {}
      }
    });

    TestBed.configureTestingModule({
      providers: [ShoppingCartService]
    });

    service = TestBed.inject(ShoppingCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cart operations', () => {
    const testProduct = mockProducts[0];

    it('should add new product to empty cart', () => {
      service.addToCart(testProduct);

      expect(service.items()).toEqual([
        { product: testProduct, quantity: 1 }
      ]);
      expect(service.count()).toBe(1);
      expect(service.total()).toBe(testProduct.price);
    });

    it('should increase quantity for existing product', () => {
      service.addToCart(testProduct, 1);
      service.addToCart(testProduct, 2);

      expect(service.items()).toEqual([
        { product: testProduct, quantity: 3 }
      ]);
      expect(service.count()).toBe(3);
      expect(service.total()).toBe(testProduct.price * 3);
    });

    it('should respect maxKgs limit when adding products', () => {
      service.addToCart(testProduct, testProduct.maxKgs + 5);

      expect(service.items()[0].quantity).toBe(testProduct.maxKgs);
    });

    it('should remove product from cart', () => {
      service.addToCart(testProduct, 1);
      service.removeFromCart(testProduct.id);

      expect(service.items()).toEqual([]);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);
    });

    it('should preserve other cart items when adding to an existing item', () => {
      const firstProduct: Product = mockProducts[0];
      const secondProduct: Product = mockProducts[1];

      service.addToCart(firstProduct, 1);
      service.addToCart(secondProduct, 2);

      expect(service.items().length).toBe(2);
      expect(service.items()[0].product.id).toBe(firstProduct.id);
      expect(service.items()[0].quantity).toBe(1);
      expect(service.items()[1].product.id).toBe(secondProduct.id);
      expect(service.items()[1].quantity).toBe(2);

      service.addToCart(firstProduct, 3);

      expect(service.items()[0].product.id).toBe(firstProduct.id);
      expect(service.items()[0].quantity).toBe(4);

      expect(service.items()[1].product.id).toBe(secondProduct.id);
      expect(service.items()[1].quantity).toBe(2);

      expect(service.items().length).toBe(2);
      expect(service.count()).toBe(6);
      expect(service.total()).toBe(firstProduct.price * 4 + secondProduct.price * 2);
    });

    it('should update quantity within limits', () => {
      service.addToCart(testProduct, 1);
      service.updateQuantity(testProduct.id, 3, testProduct.maxKgs);

      expect(service.items()[0].quantity).toBe(3);
    });

    it('should not update quantity above maxKgs', () => {
      service.addToCart(testProduct, 1);
      service.updateQuantity(testProduct.id, testProduct.maxKgs + 5, testProduct.maxKgs);

      expect(service.items()[0].quantity).toBe(testProduct.maxKgs);
    });
  });

  describe('quantity checks', () => {
    const testProduct = mockProducts[0];

    it('should allow increase when below maxKgs', () => {
      service.addToCart(testProduct, 1);

      expect(service.canIncreaseQuantity(testProduct.id, 1)).toBe(true);
    });

    it('should not allow increase when at maxKgs', () => {
      service.addToCart(testProduct, testProduct.maxKgs);

      expect(service.canIncreaseQuantity(testProduct.id, 1)).toBe(false);
    });

    it('should handle non-existent product', () => {
      expect(service.canIncreaseQuantity('non-existent')).toBe(true);
    });
  });

  describe('updateQuantity method', () => {
    const testProduct = mockProducts[0];

    beforeEach(() => {
      service.addToCart(testProduct, 1);
    });

    it('should update quantity for existing product', () => {
      service.updateQuantity(testProduct.id, 3, testProduct.maxKgs);

      expect(service.items()[0].quantity).toBe(3);
      expect(service.count()).toBe(3);
      expect(service.total()).toBe(testProduct.price * 3);
    });

    it('should not update quantity when new quantity is less than 1', () => {
      service.updateQuantity(testProduct.id, 0, testProduct.maxKgs);

      expect(service.items()[0].quantity).toBe(1);
    });

    it('should not update quantity above maxKgs limit', () => {
      service.updateQuantity(testProduct.id, testProduct.maxKgs + 2, testProduct.maxKgs);

      expect(service.items()[0].quantity).toBe(testProduct.maxKgs);
    });

    it('should not affect other products in cart', () => {
      const secondProduct = mockProducts[1];
      service.addToCart(secondProduct, 2);

      service.updateQuantity(testProduct.id, 3, testProduct.maxKgs);

      expect(service.items()).toEqual([
        { product: testProduct, quantity: 3 },
        { product: secondProduct, quantity: 2 }
      ]);
    });

    it('should persist changes to localStorage', () => {
      service.updateQuantity(testProduct.id, 3, testProduct.maxKgs);

      const savedCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
      expect(savedCart[0].quantity).toBe(3);
    });
  });

  describe('persistence', () => {
    it('should load cart from localStorage on creation', () => {
      const testProduct = mockProducts[0];
      const savedCart = [{ product: testProduct, quantity: 2 }];

      localStorage.clear();
      localStorage.setItem('shoppingCart', JSON.stringify(savedCart));

      TestBed.resetTestingModule();
      const newService = TestBed.inject(ShoppingCartService);

      expect(JSON.stringify(newService.items())).toBe(JSON.stringify(savedCart));
    });

    it('should save cart to localStorage on changes', () => {
      const testProduct = mockProducts[0];
      service.addToCart(testProduct, 1);

      const savedCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
      expect(savedCart).toEqual([{ product: testProduct, quantity: 1 }]);
    });
  });
});
