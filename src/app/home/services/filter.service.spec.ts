import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { ProductsService } from './products.service';
import { mockProducts } from '@core/mocks/products';
import { Product } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { of } from 'rxjs';

describe('FilterService', () => {
  let service: FilterService;
  let productsService: jest.Mocked<ProductsService>;

  const mockProductsResponse = {
    results: mockProducts,
    totalItems: mockProducts.length,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  };

  beforeEach(() => {
    const productsServiceMock = {
      getProducts: jest.fn().mockReturnValue(of(mockProductsResponse))
    };

    TestBed.configureTestingModule({
      providers: [
        FilterService,
        { provide: ProductsService, useValue: productsServiceMock }
      ]
    });

    service = TestBed.inject(FilterService);
    productsService = TestBed.inject(ProductsService) as jest.Mocked<ProductsService>;

    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeFilters', () => {
    it('should initialize filters with correct counts and price range', () => {
      const testProducts: Product[] = [
        { ...mockProducts[0], price: 10, rate: 5 },
        { ...mockProducts[1], price: 20, rate: 4 },
        { ...mockProducts[2], price: 30, rate: 3 }
      ];

      jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify([testProducts[0]]));

      service.initializeFilters(testProducts);
      const state = service.getState()();

      expect(state.priceRange.min).toBe(10);
      expect(state.priceRange.max).toBe(30);
      expect(state.wishlist.count).toBe(1);
      expect(state.nonWishlist.count).toBe(2);
    });
  });

  describe('filterProducts', () => {
    it('should filter products based on active filters', (done) => {
      const category = Category.FRUITANDVEGETABLES;
      const testProducts = [...mockProducts];

      jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify([testProducts[0]]));

      service.filterProducts(10, [1], category).subscribe(filteredProducts => {
        expect(productsService.getProducts).toHaveBeenCalled();
        expect(filteredProducts.totalItems).toBeGreaterThanOrEqual(0);
        done();
      });
    });
  });

  describe('toggleFilter', () => {
    it('should toggle wishlist filter', () => {
      const initialState = service.getState()();
      service.toggleFilter('wishlist');
      const newState = service.getState()();

      expect(newState.wishlist.checked).toBe(!initialState.wishlist.checked);
    });

    it('should toggle rating filter', () => {
      const ratingId = '5';
      const initialState = service.getState()();
      service.toggleFilter(ratingId);
      const newState = service.getState()();

      const rating = newState.ratings.find(r => r.id === ratingId);
      expect(rating?.checked).toBe(!initialState.ratings.find(r => r.id === ratingId)?.checked);
    });
  });

  describe('updatePriceRange', () => {
    it('should update price range', () => {
      const newRange = { min: 10, max: 50 };
      service.updatePriceRange(newRange);

      const state = service.getState()();
      expect(state.priceRange.current).toEqual(newRange);
    });
  });

  describe('resetAllFilters', () => {
    it('should reset all filters to default state', () => {
      service.toggleFilter('wishlist');
      service.toggleFilter('5');
      service.updatePriceRange({ min: 10, max: 50 });

      service.resetAllFilters();
      const state = service.getState()();

      expect(state.wishlist.checked).toBe(true);
      expect(state.nonWishlist.checked).toBe(true);
      expect(state.ratings.every(r => r.checked)).toBe(true);
      expect(state.priceRange.current).toEqual({
        min: state.priceRange.min,
        max: state.priceRange.max
      });
    });
  });

  describe('getActiveFilters', () => {
    it('should return correct active filters', () => {
      service.toggleFilter('wishlist');
      service.updatePriceRange({ min: 10, max: 50 });
      service.applyFilters();

      const activeFilters = service.appliedFilters();

      expect(activeFilters).toContainEqual(expect.objectContaining({
        id: 'price',
        type: 'range'
      }));
      expect(activeFilters.some(f => f.id === 'wishlist')).toBe(false);
    });

    it('should include wishlist in active filters when wishlist is checked', () => {
      service.resetAllFilters();
      service.applyFilters();

      const activeFilters = service.appliedFilters();

      const wishlistFilter = activeFilters.find(f => f.id === 'wishlist');
      expect(wishlistFilter).toBeTruthy();
      expect(wishlistFilter?.type).toBe('tag');
    });

    it('should include price range in active filters only when price range is modified', () => {
      const testProducts: Product[] = [
        { ...mockProducts[0], price: 10 },
        { ...mockProducts[1], price: 20 },
        { ...mockProducts[2], price: 30 }
      ];
      service.initializeFilters(testProducts);

      service.applyFilters();
      let activeFilters = service.appliedFilters();
      expect(activeFilters.some(f => f.id === 'price')).toBe(false);

      const newRange = { min: 15, max: 25 };
      service.updatePriceRange(newRange);
      service.applyFilters();
      activeFilters = service.appliedFilters();

      const priceFilter = activeFilters.find(f => f.id === 'price');
      expect(priceFilter).toBeTruthy();
      expect(priceFilter?.type).toBe('range');
      expect(priceFilter?.label).toBe('Price: 15-25');
    });
  });

  describe('getWishlistProducts', () => {
    it('should return parsed wishlist from localStorage', () => {
      const mockWishlistProducts = [mockProducts[0], mockProducts[1]];
      jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockWishlistProducts));

      service.initializeFilters(mockProducts);
      const state = service.getState()();

      expect(state.wishlist.count).toBe(2);
    });

    it('should return empty array when localStorage wishlist is null', () => {
      jest.spyOn(localStorage, 'getItem').mockReturnValue(null);

      service.initializeFilters(mockProducts);
      const state = service.getState()();

      expect(state.wishlist.count).toBe(0);
    });
  });
});
