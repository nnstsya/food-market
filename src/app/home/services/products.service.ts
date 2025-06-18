import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, EMPTY } from 'rxjs';
import { Product, Response } from '@core/models/product.model';
import { Category, Subcategory } from "@core/models/category.model";
import { ToastService } from "@shared/components/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);
  private basePath: string = '/products';
  private toastService: ToastService = inject(ToastService);

  getProducts(page: number = 1, pageSize: number = 10, categoryOrSubcategory: Category | Subcategory | null = null, priceMin: number | null = null, priceMax: number | null = null, rate: number[] = [1, 2, 3, 4, 5]): Observable<Response> {
    const isCategory: boolean = Object.values(Category).includes(categoryOrSubcategory as Category);
    const isSubcategory: boolean = Object.values(Subcategory).includes(categoryOrSubcategory as Subcategory);

    const params: HttpParams = this.buildQueryParams({
      page,
      pageSize,
      ...(isCategory ? { category: categoryOrSubcategory } : {}),
      ...(isSubcategory ? { subcategory: categoryOrSubcategory } : {}),
      priceMin,
      priceMax,
      rate
    });

    return this.http.get<Response>(this.basePath, { params }).pipe(
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message ||
              'Failed to fetch products information.',
            ),
        ),
      ),
    );
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(this.basePath + '/' + productId).pipe(
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message ||
              'Failed to fetch product information.',
            ),
        ),
      ),
    );
  }

  addToWishList(productId: string): Observable<void> {
    if (!localStorage.getItem('user')) {
      this.toastService.show('Only authorized users can add products to the wishlist.');
      return EMPTY;
    }

    return this.http.post<void>(this.basePath + '/favorites', {productId}).pipe(
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message ||
              'Failed to add product to wishlist.',
            ),
        ),
      ),
    );
  }

  removeFromWishList(productId: string): Observable<void> {
    const params: HttpParams = new HttpParams().set('productId', productId);

    return this.http.delete<void>(this.basePath + '/favorites', { params }).pipe(
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message ||
              'Failed to remove product from wishlist.',
            ),
        ),
      ),
    );
  }

  getWishList(): Observable<Response> {
    return this.http.get<Response>(this.basePath + '/favorites').pipe(
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message ||
              'Failed to fetch wishlist information.',
            ),
        ),
      ),
    );
  }

  private buildQueryParams(paramsObj: Record<string, any>): HttpParams {
    let params: HttpParams = new HttpParams();

    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const stringValue: string = typeof value === 'string' ? value : value.toString();
        params = params.set(key, stringValue);
      }
    });

    return params;
  }
}
