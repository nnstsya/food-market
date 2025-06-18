import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { mockProducts } from '@core/mocks/products';
import { Category, Subcategory } from '@core/models/category.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let toastService: jest.Mocked<ToastService>;

  beforeEach(() => {
    const toastServiceMock = {
      show: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: ToastService, useValue: toastServiceMock }
      ]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getProducts', () => {
    it('should fetch products with default parameters', () => {
      const mockResponse = {
        results: mockProducts,
        totalItems: mockProducts.length,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
      };

      service.getProducts().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.url === '/products');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');

      req.flush(mockResponse);
    });

    it('should include category filter when provided', () => {
      service.getProducts(1, 10, Category.FRUITANDVEGETABLES).subscribe();

      const req = httpMock.expectOne(req => req.url === '/products');
      expect(req.request.params.has('category')).toBeTruthy();
      expect(req.request.params.get('category')).toBe(Category.FRUITANDVEGETABLES);
    });

    it('should include subcategory filter when provided', () => {
      service.getProducts(1, 10, Subcategory.VEGETABLES).subscribe();

      const req = httpMock.expectOne(req => req.url === '/products');
      expect(req.request.params.has('subcategory')).toBeTruthy();
      expect(req.request.params.get('subcategory')).toBe('VEGETABLES');
    });

    it('should not include category if categoryOrSubcategory is undefined', () => {
      service.getProducts(1, 10, undefined).subscribe();

      const req = httpMock.expectOne(req => req.url === '/products');
      expect(req.request.params.has('category')).toBeFalsy();
    });

    it('should handle error response in getProducts', (done) => {
      service.getProducts().subscribe({
        error: (error) => {
          expect(error.message).toContain('Failed to fetch products');
          done();
        }
      });

      const req = httpMock.expectOne(req => req.url === '/products');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getProductById', () => {
    it('should fetch single product by id', () => {
      const mockProduct = mockProducts[0];

      service.getProductById(mockProduct.id).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`/products/${mockProduct.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle error response in getProductById', (done) => {
      const mockProductId = '1';
      service.getProductById(mockProductId).subscribe({
        error: (error) => {
          expect(error.message).toContain('Failed to fetch product information');
          done();
        }
      });

      const req = httpMock.expectOne(`/products/${mockProductId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('wishlist operations', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should not add to wishlist for unauthorized user', () => {
      localStorage.removeItem('user');

      service.addToWishList('1').subscribe(() => {
        expect(toastService.show).toHaveBeenCalledWith(
          'Only authorized users can add products to the wishlist.'
        );
      });
    });

    it('should add to wishlist for authorized user', () => {
      localStorage.setItem('user', JSON.stringify({ id: '1' }));

      service.addToWishList('1').subscribe();

      const req = httpMock.expectOne('/products/favorites');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ productId: '1' });
      req.flush({});
    });

    it('should handle error response in addToWishList', (done) => {
      localStorage.setItem('user', JSON.stringify({ id: '1' }));

      service.addToWishList('1').subscribe({
        error: (error) => {
          expect(error.message).toContain('Failed to add product to wishlist');
          done();
        }
      });

      const req = httpMock.expectOne('/products/favorites');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should remove from wishlist', () => {
      service.removeFromWishList('1').subscribe();

      const req = httpMock.expectOne(req =>
        req.url === '/products/favorites' &&
        req.params.get('productId') === '1'
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle error response in removeFromWishList', (done) => {
      service.removeFromWishList('1').subscribe({
        error: (error) => {
          expect(error.message).toContain('Failed to remove product from wishlist');
          done();
        }
      });

      const req = httpMock.expectOne(req => req.url === '/products/favorites' && req.params.get('productId') === '1');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should fetch wishlist', () => {
      const mockResponse = {
        results: [mockProducts[0]],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
      };

      service.getWishList().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/products/favorites');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response in getWishList', (done) => {
      service.getWishList().subscribe({
        error: (error) => {
          expect(error.message).toContain('Failed to fetch wishlist information');
          done();
        }
      });

      const req = httpMock.expectOne('/products/favorites');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});

