import { DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ActiveFilter, FilterState, FilterValue, PriceRange, RatingCheckbox } from '../models/filter.model';
import { Product, Response } from '@core/models/product.model';
import { ProductsService } from "@home/services/products.service";
import { Category } from "@core/models/category.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { forkJoin, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  appliedFilters: WritableSignal<ActiveFilter[]> = signal<ActiveFilter[]>([]);

  private state: WritableSignal<FilterState> = signal<FilterState>({
    wishlist: this.createTagFilter('wishlist', 'In Wishlist'),
    nonWishlist: this.createTagFilter('nonWishlist', 'Not in Wishlist'),
    ratings: this.createRatingFilters(),
    priceRange: this.createPriceRange()
  });
  private productsService: ProductsService = inject(ProductsService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  getState(): WritableSignal<FilterState> {
    return this.state;
  }

  applyFilters(): void {
    this.appliedFilters.set(this.getActiveFilters());
  }

  toggleFilter(type: 'wishlist' | 'nonWishlist' | string): void {
    this.state.update((state: FilterState) => {
      if (type === 'wishlist' || type === 'nonWishlist') {
        return {
          ...state,
          [type]: {
            ...state[type],
            checked: !state[type].checked
          }
        };
      } else {
        return {
          ...state,
          ratings: state.ratings.map((rating: RatingCheckbox) =>
            rating.id === type ? { ...rating, checked: !rating.checked } : rating
          )
        };
      }
    });
  }

  updatePriceRange(range: { min: number; max: number }): void {
    this.state.update((state: FilterState) => ({
      ...state,
      priceRange: { ...state.priceRange, current: range }
    }));
  }

  resetAllFilters(): void {
    this.state.update((state: FilterState) => ({
      ...state,
      wishlist: { ...state.wishlist, checked: true },
      nonWishlist: { ...state.nonWishlist, checked: true },
      ratings: state.ratings.map((r: RatingCheckbox) => ({ ...r, checked: true })),
      priceRange: { ...state.priceRange, current: { min: state.priceRange.min, max: state.priceRange.max } }
    }));
  }

  initializeFilters(products: Product[]): void {
    const wishlistProducts: Product[] = this.getWishlistProducts();
    const prices: number[] = products.map((p: Product) => p.price);
    const minPrice: number = Math.floor(Math.min(...prices));
    const maxPrice: number = Math.ceil(Math.max(...prices));

    this.state.update((state: FilterState) => ({
      ...state,
      wishlist: { ...state.wishlist, count: products.filter(p => wishlistProducts.some(w => w.id === p.id)).length },
      nonWishlist: { ...state.nonWishlist, count: products.filter(p => !wishlistProducts.some(w => w.id === p.id)).length },
      ratings: state.ratings.map((rating: RatingCheckbox) => ({
        ...rating,
        count: products.filter((p: Product) => rating.id === Math.round(p.rate!).toString()).length
      })),
      priceRange: { min: minPrice, max: maxPrice, current: { min: minPrice, max: maxPrice } }
    }));
  }

  filterProducts(pageSize: number, currentPages: number[], category: Category): Observable<Response> {
    const { priceRange, ratings, wishlist, nonWishlist } = this.state();
    const wishlistProducts: Product[] = this.getWishlistProducts();

    const rate: number[] = [...ratings.filter(r => r.checked).map(r => Number(r.id))];

    const requests = currentPages.map(page =>
      this.productsService.getProducts(page, pageSize, category, priceRange.current.min, priceRange.current.max, rate)
    );

    return forkJoin(requests).pipe(
      map(responses => {
        return {
          ...responses[0],
          results: responses.flatMap(res => res.results).filter((product: Product) => {
            const inWishlist: boolean = wishlistProducts.some((w: Product) => w.id === product.id);
            return (wishlist.checked && inWishlist) || (nonWishlist.checked && !inWishlist);
          })
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private getActiveFilters(): ActiveFilter[] {
    const { wishlist, nonWishlist, ratings, priceRange } = this.state();
    const filters: ActiveFilter[] = [];

    if (wishlist.checked) filters.push({ id: wishlist.id, label: wishlist.label, type: wishlist.type });
    if (nonWishlist.checked) filters.push({ id: nonWishlist.id, label: nonWishlist.label, type: nonWishlist.type });

    ratings.filter(r => r.checked).forEach(r =>
      filters.push({ id: r.id, label: '', type: r.type, ratingArray: r.ratingArray })
    );

    if (priceRange.current.min !== priceRange.min || priceRange.current.max !== priceRange.max) {
      filters.push({
        id: 'price',
        label: `Price: ${priceRange.current.min}-${priceRange.current.max}`,
        type: 'range',
        priceRange: { ...priceRange }
      });
    }

    return filters;
  }

  private createTagFilter(id: string, label: string): FilterValue {
    return { id, label, count: 0, checked: true, type: 'tag' };
  }

  private createRatingFilters(): RatingCheckbox[] {
    return [5, 4, 3, 2, 1].map((rating: number) => ({
      id: rating.toString(),
      ratingArray: Array(5).fill(0).map((_: number, i: number) => (i < rating ? 1 : 0)),
      count: 0,
      checked: true,
      type: 'checkbox'
    }));
  }

  private createPriceRange(): PriceRange {
    return { min: 0, max: 0, current: { min: 0, max: 0 } };
  }

  private getWishlistProducts(): Product[] {
    const wishlist: string | null = localStorage.getItem('wishList');
    return wishlist ? JSON.parse(wishlist) : [];
  }
}

