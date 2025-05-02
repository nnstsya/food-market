import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from '@home/services/products.service';
import { FilterService } from '@home/services/filter.service';
import { SharedModule } from "@shared/shared.module";
import { HomeModule } from "@home/home.module";
import { mockProducts } from "@core/mocks/products";
import { Product, Response } from "@core/models/product.model";
import { Category } from "@core/models/category.model";

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  const mockProductsService = {
    getProducts: jest.fn(),
    getProductsByCategory: jest.fn(),
    getWishList: jest.fn()
  };

  const productsMock: Product[] = mockProducts;

  const mockFilterService = {
    initializeFilters: jest.fn(),
    applyFilters: jest.fn(),
    toggleFilter: jest.fn(),
    updatePriceRange: jest.fn(),
    resetAllFilters: jest.fn(),
    filterProducts: jest.fn().mockReturnValue(of([])),
    getState: jest.fn(() => () => ({
      priceRange: { min: 0, max: 100 },
      ratings: [],
      wishlist: { label: 'Wishlist', count: 0, checked: false },
      nonWishlist: { label: 'NonWishlist', count: 0, checked: false }
    })),
    appliedFilters: jest.fn(() => [])
  };

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => (key === 'category' ? 'FRUITANDVEGETABLES' : null)
    })
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [SharedModule, HomeModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set categoryName and fetch products when category param is valid', () => {
    expect(component.categoryName).toBeDefined();
    mockProductsService.getProductsByCategory = jest.fn().mockReturnValue(of({ results: productsMock, totalItems: productsMock.length }));
  });

  it('should set categoryName to null when category param is invalid', () => {
    TestBed.resetTestingModule();
    const invalidRoute = {
      paramMap: of({
        get: (key: string) => (key === 'category' ? 'INVALID_CATEGORY' : null)
      })
    };

    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [SharedModule, HomeModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: ActivatedRoute, useValue: invalidRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.categoryName).toBeNull();
    expect(mockProductsService.getProductsByCategory).not.toHaveBeenCalled();
  });

  it('should set categoryName to null when category param is null', () => {
    TestBed.resetTestingModule();
    const nullRoute = {
      paramMap: of({
        get: () => null
      })
    };

    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [SharedModule, HomeModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: ActivatedRoute, useValue: nullRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;

    expect(component.categoryName).toBeNull();
    expect(mockProductsService.getProductsByCategory).not.toHaveBeenCalled();
  });

  it('should map products with wishlist status when fetching products', fakeAsync(() => {
    const wishlistProducts = {
      results: [mockProducts[0]],
      totalItems: 1,
      pageSize: 4,
      totalPages: 1,
      currentPage: 1
    };

    mockProductsService.getProducts.mockReturnValue(
      of({
        results: mockProducts,
        totalItems: mockProducts.length,
        pageSize: 4,
        totalPages: 2,
        currentPage: [1, 2]
      })
    );

    mockProductsService.getWishList.mockReturnValue(of(wishlistProducts));

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    tick();

    component.originalProducts = [
      { ...mockProducts[0], isInWishlist: true },
      { ...mockProducts[1], isInWishlist: false },
      { ...mockProducts[2], isInWishlist: false },
      { ...mockProducts[3], isInWishlist: false },
      { ...mockProducts[4], isInWishlist: false },
    ];

    expect(component.originalProducts).toEqual([
      { ...mockProducts[0], isInWishlist: true },
      { ...mockProducts[1], isInWishlist: false },
      { ...mockProducts[2], isInWishlist: false },
      { ...mockProducts[3], isInWishlist: false },
      { ...mockProducts[4], isInWishlist: false },
    ]);
  }));

  it('should apply filters and update displayedProducts', () => {
    const mockResponse: Response = {
      results: [mockProducts[0]],
      totalItems: 1,
      pageSize: 5,
      totalPages: 1,
      currentPage: 1
    };
    mockFilterService.filterProducts.mockReturnValue(of(mockResponse));

    component.applyFilters();

    expect(mockFilterService.filterProducts).toHaveBeenCalled();
    expect(mockFilterService.applyFilters).toHaveBeenCalled();
    expect(component.products).toEqual(mockResponse.results);
    expect(component.productsQuantity).toBe(mockResponse.totalItems);
    expect(component.displayedProducts).toEqual(mockResponse.results);
  });

  it('should remove filter tag and reset price filter when filterId is "price"', () => {
    component.priceFilter = { reset: jest.fn() } as any;
    component.onFilterTagRemoved('price');
    expect(mockFilterService.toggleFilter).toHaveBeenCalledWith('price');
    expect(mockFilterService.updatePriceRange).toHaveBeenCalled();
    expect(component.priceFilter.reset).toHaveBeenCalled();
  });

  it('should change view and update localStorage', () => {
    component.changeView('list');
    expect(component.view).toBe('list');
    expect(localStorage.getItem('viewMode')).toBe('list');
  });

  it('should update displayed products on page change', () => {
    mockProductsService.getProducts.mockReturnValue(of({
      results: mockProducts.slice(0, 5),
      totalItems: mockProducts.length,
      pageSize: 4,
      totalPages: 2,
      currentPage: 1
    }));

    component.onSelectedPagesChange([1]);
    expect(component.displayedProducts.length).toBeLessThanOrEqual(5);
  });

  it('should call toggleFilter on filter change', () => {
    component.onFilterChange('wishlist');
    expect(mockFilterService.toggleFilter).toHaveBeenCalledWith('wishlist');
  });

  it('should set page to first when applying filters', () => {
    const spy = jest.spyOn(component, 'applyFilters');
    component.onFiltersApply();
    expect(component.currentPages).toEqual([1]);
    expect(spy).toHaveBeenCalled();
  });

  it('should update price range', () => {
    const range = { min: 10, max: 100 };
    component.onPriceRangeChange(range);
    expect(mockFilterService.updatePriceRange).toHaveBeenCalledWith(range);
  });

  it('should reset all filters and call applyFilters', () => {
    component.priceFilter = { reset: jest.fn() } as any;
    const spyApply = jest.spyOn(component, 'applyFilters');
    component.onResetFilters();
    expect(mockFilterService.resetAllFilters).toHaveBeenCalled();
    expect(spyApply).toHaveBeenCalled();
    expect(component.priceFilter.reset).toHaveBeenCalled();
  });

  it('should load current pages from localStorage on init', () => {
    localStorage.setItem('currentPages', '[1]');
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.currentPages).toEqual([1]);
  });

  it('should handle updateDisplayedProducts with multiple pages', fakeAsync(() => {
    component.currentPages = [1, 2];
    component.category = Category.FRUITANDVEGETABLES;
    component.productsPerPage = 2;

    const page1Products = mockProducts.slice(0, 2);
    const page2Products = mockProducts.slice(2, 4);

    mockProductsService.getProducts.mockReset();

    mockProductsService.getProducts
      .mockReturnValueOnce(of({ results: page1Products, totalItems: mockProducts.length }))
      .mockReturnValueOnce(of({ results: page2Products, totalItems: mockProducts.length }));

    component['updateDisplayedProducts']();
    tick();

    expect(component.displayedProducts.length).toBe(4);
    expect(mockProductsService.getProducts).toHaveBeenCalledTimes(2);
  }));

  it('should properly initialize with category param and handle wishlist', fakeAsync(() => {
    mockProductsService.getProducts.mockReset();
    mockProductsService.getWishList.mockReset();

    const mockCategoryResponse: Response = {
      results: mockProducts.slice(0, 2),
      totalItems: 2,
      pageSize: 4,
      totalPages: 1,
      currentPage: 1
    };

    const mockWishlistResponse = {
      results: [mockProducts[0]],
      totalItems: 1,
      pageSize: 4,
      totalPages: 1,
      currentPage: 1
    };

    mockProductsService.getProducts.mockReturnValue(of(mockCategoryResponse));
    mockProductsService.getWishList.mockReturnValue(of(mockWishlistResponse));

    const routeWithCategory = {
      paramMap: of({
        get: (key: string) => key === 'category' ? 'FRUITANDVEGETABLES' : null
      })
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [SharedModule, HomeModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: ActivatedRoute, useValue: routeWithCategory }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(component.categoryName).toBe('Fruit and vegetables');
    expect(component.originalProducts[0].isInWishlist).toBe(true);
    expect(component.originalProducts[1].isInWishlist).toBe(false);
    expect(mockFilterService.initializeFilters).toHaveBeenCalled();
  }));

  it('should reset currentPages when category changes', fakeAsync(() => {
    component.currentPages = [2, 3];
    component.category = Category.DRINKS;

    const newRoute = {
      paramMap: of({
        get: (key: string) => (key === 'category' ? 'FRUITANDVEGETABLES' : null)
      })
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [SharedModule, HomeModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: FilterService, useValue: mockFilterService },
        { provide: ActivatedRoute, useValue: newRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(component.currentPages).toEqual([1]);
    expect(localStorage.getItem('currentPages')).toBe('[1]');
  }));
});
