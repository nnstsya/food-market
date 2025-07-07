import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { Router } from '@angular/router';
import { SharedModule } from "@shared/shared.module";

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let shoppingCartService: jest.Mocked<ShoppingCartService>;
  let modalService: jest.Mocked<ModalService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    shoppingCartService = {
      items: jest.fn().mockReturnValue([]),
      total: jest.fn().mockReturnValue(0)
    } as unknown as jest.Mocked<ShoppingCartService>;

    const modalSpy = {
      showModal: jest.fn(),
      hideModal: jest.fn()
    } as unknown as jest.Mocked<ModalService>;

    const routerSpy = {
      navigateByUrl: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent],
      imports: [SharedModule],
      providers: [
        { provide: ShoppingCartService, useValue: shoppingCartService },
        { provide: ModalService, useValue: modalSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    shoppingCartService = TestBed.inject(ShoppingCartService) as jest.Mocked<ShoppingCartService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to checkout if authenticated', () => {
    const getItemSpy = jest.fn().mockReturnValue('some-user-data');
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemSpy }
    });

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.navigateUser();
    expect(router.navigateByUrl).toHaveBeenCalledWith('homepage/checkout');
  });

  it('should show login modal if not authenticated', () => {
    const getItemSpy = jest.fn().mockReturnValue(null);
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemSpy }
    });

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.navigateUser();
    expect(modalService.showModal).toHaveBeenCalledWith('login');
  });

  it('should close the modal', () => {
    component.closeModal();
    expect(modalService.hideModal).toHaveBeenCalled();
  });
});
