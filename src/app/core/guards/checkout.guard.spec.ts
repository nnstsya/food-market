import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { checkoutGuard } from './checkout.guard';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { Injector, runInInjectionContext } from '@angular/core';
import { mockProducts } from "@core/mocks/products";

describe('checkoutGuard', () => {
  let router: jest.Mocked<Router>;
  let cartService: jest.Mocked<ShoppingCartService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    router = { navigateByUrl: jest.fn() } as any;
    cartService = { items: jest.fn() } as any;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: ShoppingCartService, useValue: cartService }
      ]
    });
  });

  it('should allow access when cart has items', () => {
    cartService.items.mockReturnValue([{ product: mockProducts[0], quantity: 1 }]);

    const result = runInInjectionContext(TestBed.inject(Injector), () => checkoutGuard()(mockRoute, mockState));

    expect(result).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to /home when cart is empty', () => {
    cartService.items.mockReturnValue([]);

    const result = runInInjectionContext(TestBed.inject(Injector), () => checkoutGuard()(mockRoute, mockState));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    expect(result).toBeFalsy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
