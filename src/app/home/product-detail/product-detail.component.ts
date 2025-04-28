import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@home/services/products.service';
import { map, Observable, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BuyBy, Product } from "@core/models/product.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { getEnumValue } from "@core/utils/enum.util";
import { Category } from "@core/models/category.model";
import { Stock } from "@core/models/stock.model";
import { Option } from "@shared/components/dropdown/dropdown.component";
import { buyByOptions } from "@core/mocks/products";
import { categoriesData } from "@core/mocks/categories";
import { ShoppingCartService } from "@home/services/shopping-cart.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  buyByOptions: Option[] = buyByOptions;
  quantity: number = 1;
  isAuthenticated: boolean = !!localStorage.getItem('user');
  isInWishlist: boolean = false;

  private productsService: ProductsService = inject(ProductsService);
  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);

  get freshness(): string {
    return this.product?.freshness === 1 ? '1 day old' : `${this.product?.freshness} days old`;
  }

  get deliveryDays(): string {
    if (this.product?.deliveryDays === 0) return 'Today';
    return this.product?.deliveryDays === 1 ? 'In 1 day' : `In ${this.product?.deliveryDays} days`;
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const productId: string = params.get('id')!;
        return this.productsService.getProductById(productId).pipe(
          map((product: Product) => {
            this.product = product;
            this.updateBuyByOptions();
            this.checkIfInWishList(this.product!).subscribe();

            return this.product;
          })
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  getRatingArray(rate: number): number[] {
    return [1, 1, 1, 1, 1].fill(0, Math.round(rate), 5);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/image-placeholder.jpg';
  }

  addToWishList(product: Product): void {
    this.productsService.addToWishList(product.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.isInWishlist = true;
  }

  removeFromWishList(product: Product): void {
    this.productsService.removeFromWishList(product.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.isInWishlist = false;
  }

  checkIfInWishList(product: Product): Observable<boolean> {
    return this.productsService.getWishList().pipe(
      map(wishList => wishList.results.some((wishListProduct: Product) => product.id === wishListProduct.id)),
      tap((result: boolean) => this.isInWishlist = result),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  getFormattedCategory(category: string): string {
    return categoriesData[category.toUpperCase() as keyof typeof Category];
  }

  getFormattedStock(stock: string): string {
    return getEnumValue(Stock, stock);
  }

  getFormattedBuyOptions(): string {
   let uniqueOptions: string[] = this.buyByOptions.map(option => option?.title || '').filter((value, index, array) => {
      return array.lastIndexOf(value) === index;
    });

    return uniqueOptions.join(', ') || '';
  }

  getUrlCategoryName(title: string): string {
   return this.getFormattedCategory(title).split(' ').join('').toLowerCase();
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.product!, Number(this.quantity));
  }

  private updateBuyByOptions(): void {
    this.buyByOptions = buyByOptions.filter(option =>
      this.product?.buyBy.some(buyBy =>
        Object.entries(BuyBy).some(([key, value]) =>
          key === buyBy && value === option.title
        )
      )
    ).filter((option, index, self) =>
      self.findIndex(o => o.title === option.title) === index
    );
  }
}
