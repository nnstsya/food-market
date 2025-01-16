import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, Observable, throwError } from 'rxjs';
import { Product } from '@core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);
  private basePath: string = '/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.basePath).pipe(
      delay(1000),
      catchError(() =>
        throwError(() => new Error('Failed to fetch products information.')),
      ),
    );
  }
}
