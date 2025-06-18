import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderSummaryComponent } from './order-summary.component';
import { ShoppingCartService } from '@home/services/shopping-cart.service';
import { mockProducts } from '@core/mocks/products';
import { ProductCart } from '@core/models/product.model';
import { HomeModule } from "@home/home.module";
import { HttpClientModule } from "@angular/common/http";
import { signal, WritableSignal } from '@angular/core';

describe('OrderSummaryComponent', () => {
  let component: OrderSummaryComponent;
  let fixture: ComponentFixture<OrderSummaryComponent>;
  let cartService: { items: WritableSignal<ProductCart[]>; total: WritableSignal<number> };
  let itemsSignal: WritableSignal<ProductCart[]>;
  let totalSignal: WritableSignal<number>;

  const mockCartItems: ProductCart[] = [
    { product: mockProducts[0], quantity: 2 },
    { product: mockProducts[1], quantity: 1 }
  ];

  beforeEach(async () => {
    itemsSignal = signal(mockCartItems);
    totalSignal = signal(150);

    cartService = {
      items: itemsSignal,
      total: totalSignal
    };

    await TestBed.configureTestingModule({
      declarations: [OrderSummaryComponent],
      imports: [HomeModule, HttpClientModule],
      providers: [
        { provide: ShoppingCartService, useValue: cartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with cart items', () => {
    expect(component.products).toEqual(mockCartItems);
    expect(cartService.items()).toEqual(mockCartItems);
  });

  it('should display correct total price', () => {
    expect(component.totalPrice).toBe(150);
    expect(cartService.total()).toBe(150);
  });

  it('should update when cart items change', () => {
    const newCartItems: ProductCart[] = [{ product: mockProducts[0], quantity: 1 }];
    itemsSignal.set(newCartItems);
    totalSignal.set(75);

    fixture.detectChanges();

    expect(component.products).toEqual(newCartItems);
    expect(component.totalPrice).toBe(75);
  });
});
