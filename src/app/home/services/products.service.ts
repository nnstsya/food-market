import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from '@core/models/product.model';
import { Category } from "@core/models/category.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);
  private API_URL: string = 'http://localhost:3000/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      catchError(() => throwError(() => new Error('Failed to fetch products information.'))),
    );
  }

  getProductsByCategory(category: Category): Observable<Product[]> {
    const params: HttpParams = new HttpParams().set('category', category);

    return this.http.get<Product[]>(this.API_URL, { params }).pipe(
      catchError(() => throwError(() => new Error('Failed to fetch products information.'))),
    )
  }

  addToWishList(product: Product): void {
    const wishList: Product[] = this.getWishList();
    wishList.push(product)

    localStorage.setItem('wishList', JSON.stringify(wishList));
  }

  removeFromWishList(product: Product): void {
    const wishList: Product[] = this.getWishList();

    localStorage.setItem('wishList', JSON.stringify(wishList.filter((wishListProduct: Product) => product.id !== wishListProduct.id)));
  }

  getWishList(): Product[] {
    const wishList: string | null = localStorage.getItem('wishList');

    return wishList ? JSON.parse(wishList) : [];
  }
}
