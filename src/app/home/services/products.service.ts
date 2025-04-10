import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, throwError } from 'rxjs';
import { Product, Response } from '@core/models/product.model';
import { Category } from "@core/models/category.model";
import { ToastService } from "@shared/components/toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);
  private basePath: string = '/products';
  private toastService: ToastService = inject(ToastService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Response>(this.basePath).pipe(
      map((response: Response) => response.results),
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

  getProductsByCategory(category: Category): Observable<Product[]> {
    const params: HttpParams = new HttpParams().set('category', category);

    return this.http.get<Response>(this.basePath, { params }).pipe(
      map((response: Response) => response.results),
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message ||
              'Failed to fetch products information.',
            ),
        ),
      ),
    )
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
}
