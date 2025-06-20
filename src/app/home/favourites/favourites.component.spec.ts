import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FavouritesComponent } from './favourites.component';
import { ProductsService } from '@home/services/products.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { SharedModule } from '@shared/shared.module';
import { HomeModule } from '@home/home.module';
import { mockProducts } from '@core/mocks/products';
import { of, throwError } from 'rxjs';

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;

  const mockProductsService = {
    getWishList: jest.fn()
  };

  const mockToastService = {
    show: jest.fn()
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [FavouritesComponent],
      imports: [SharedModule, HomeModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorite products on init', fakeAsync(() => {
    const mockResponse = {
      results: mockProducts.slice(0, 2),
      totalItems: 2,
      pageSize: 8,
      totalPages: 1,
      currentPage: 1
    };

    mockProductsService.getWishList.mockReturnValue(of(mockResponse));

    fixture.detectChanges();
    tick();

    expect(component.products).toEqual(mockProducts.slice(0, 2));
    expect(component.productsQuantity).toBe(2);
    expect(component.displayedProducts).toEqual(mockProducts.slice(0, 2));
  }));

  it('should show error toast when loading favorites fails', fakeAsync(() => {
    mockProductsService.getWishList.mockReturnValue(throwError(() => new Error('Failed')));

    fixture.detectChanges();
    tick();

    expect(mockToastService.show).toHaveBeenCalledWith('Failed to load favorite products');
  }));

  it('should change view and update localStorage', () => {
    component.changeView('list');
    expect(component.view).toBe('list');
    expect(localStorage.getItem('viewMode')).toBe('list');

    component.changeView('grid');
    expect(component.view).toBe('grid');
    expect(localStorage.getItem('viewMode')).toBe('grid');
  });

  it('should update displayed products when page changes', fakeAsync(() => {
    component.products = Array.from({length: 10}, (_, i) => ({
      id: (i + 1).toString(),
      name: `Product ${i + 1}`,
      price: 10,
      category: 'test',
      description: 'test',
      image: ['test.jpg'],
      rate: 4,
      isInWishlist: false,
      SKU: 'SKU123',
      subcategory: 'test-sub',
      farm: 'test-farm',
      stoke: 'in-stock',
      freshness: 1,
      buyBy: ['Weight'],
      deliveryDays: 2,
      deliveryCoast: 5,
      deliveryAria: 'local',
      maxKgs: 10,
      tax: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    component.productsPerPage = 4;
    component.onSelectedPagesChange([2]);
    tick();

    expect(component.displayedProducts.length).toBe(4);
    expect(component.displayedProducts[0].id).toBe('5');
    expect(localStorage.getItem('currentPages')).toBe('[2]');
  }));

  it('should load current pages from localStorage on init', () => {
    localStorage.setItem('currentPages', '[2,3]');
    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;

    expect(component.currentPages).toEqual([2,3]);
  });

  it('should handle empty products array', fakeAsync(() => {
    const mockResponse = {
      results: [],
      totalItems: 0,
      pageSize: 8,
      totalPages: 0,
      currentPage: 1
    };

    mockProductsService.getWishList.mockReturnValue(of(mockResponse));

    fixture.detectChanges();
    tick();

    expect(component.products).toEqual([]);
    expect(component.productsQuantity).toBe(0);
    expect(component.displayedProducts).toEqual([]);
  }));

  it('should update displayed products with correct pagination', fakeAsync(() => {
    component.products = mockProducts;
    component.productsPerPage = 3;
    component.currentPages = [1, 2];

    component.updateDisplayedProducts();
    tick();

    expect(component.displayedProducts.length).toBe(5);
    expect(component.displayedProducts[0]).toEqual(mockProducts[0]);
    expect(component.displayedProducts[4]).toEqual(mockProducts[4]);
  }));
});

