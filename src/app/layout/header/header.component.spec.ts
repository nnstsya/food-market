import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { ModalService } from '@shared/components/modal/modal.service';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { SharedModule } from "@shared/shared.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockModalService: jest.Mocked<ModalService>;
  let mockShoppingCartService: jest.Mocked<ShoppingCartService>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn(),
      url: '/',
    } as any;

    mockModalService = {
      showModal: jest.fn(),
    } as any;

    mockShoppingCartService = {
      count: jest.fn().mockReturnValue(3),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [SharedModule, HttpClientModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ModalService, useValue: mockModalService },
        { provide: ShoppingCartService, useValue: mockShoppingCartService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set isHomePage based on router url', () => {
    expect(component.isHomePage).toBe(true);
  });

  it('should set cartCount using ShoppingCartService', () => {
    expect(mockShoppingCartService.count).toHaveBeenCalled();
    expect(component.cartCount).toBe(3);
  });

  it('should open the shopping cart modal', () => {
    component.openShoppingCart();
    expect(mockModalService.showModal).toHaveBeenCalledWith('cart');
  });

  it('should navigate to /profile if authenticated', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mockToken');
    component.isAuthenticated = true;
    component.navigateUser();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/profile');
  });

  it('should open login modal if not authenticated', () => {
    component.isAuthenticated = false;
    component.navigateUser();
    expect(mockModalService.showModal).toHaveBeenCalledWith('login');
  });

  it('should convert category title to enum name correctly', () => {
    expect(component.getCategoryName('Bakery')).toBe('bakery');
  });

  it('should return true if the tab is active based on router URL', () => {
    Object.defineProperty(mockRouter, 'url', {
      get: jest.fn(() => '/homepage/bakery'),
    });

    expect(component.checkIfTabActive('Bakery')).toBe(true);
  });
});
