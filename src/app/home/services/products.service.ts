import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, Observable, throwError } from 'rxjs';
import { Product } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);
  private API_URL: string = 'http://localhost:3000/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      delay(1000),
      catchError(() => throwError(() => new Error('Failed to fetch products information.'))),
    );
  }
}
