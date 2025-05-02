import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { Injector, runInInjectionContext } from "@angular/core";

describe('authGuard', () => {
  let router: jest.Mocked<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    router = { navigateByUrl: jest.fn() } as any;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should allow access when user is authenticated', () => {
    localStorage.setItem('user', 'test-user');
    const result = runInInjectionContext(TestBed.inject(Injector), () => authGuard()(mockRoute, mockState));

    expect(result).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to home when user is not authenticated', () => {
    localStorage.removeItem('user');
    const result = runInInjectionContext(TestBed.inject(Injector), () => authGuard()(mockRoute, mockState));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    expect(result).toBeFalsy();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
});
