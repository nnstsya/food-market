import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  computed,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Category } from "@core/models/category.model";
import { categoriesData } from "@core/mocks/categories";
import { forkJoin, map, Observable } from "rxjs";
import { Product, Response } from "@core/models/product.model";
import { ProductsService } from "@home/services/products.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FilterService } from "@home/services/filter.service";
import { ActiveFilter, FilterValue, PriceRange, RatingCheckbox } from "@home/models/filter.model";
import { PriceFilterComponent } from "@home/filters/price-filter/price-filter.component";
import { switchMap } from "rxjs/operators";

type Range = { min: number; max: number };

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  standalone: false
})
export class CategoryComponent implements OnInit {
  @ViewChild(PriceFilterComponent) priceFilter!: PriceFilterComponent;

  categoryName: string | null = null;
  category: Category | null = null;
  productsQuantity: number = 0;
  view: 'list' | 'grid' = <'list' | 'grid'>localStorage.getItem('viewMode') || 'grid';
  productsPerPage: number = 5;
  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentPages: number[] = [];
  shouldResetPages: boolean = false;

  priceRange: Signal<PriceRange> = computed(() => this.filterService.getState()().priceRange);
  ratings: Signal<RatingCheckbox[]> = computed(() => this.filterService.getState()().ratings);
  wishlistFilter: Signal<FilterValue> = computed(() => this.filterService.getState()().wishlist);
  nonWishlistFilter: Signal<FilterValue> = computed(() => this.filterService.getState()().nonWishlist);
  appliedFilters: Signal<ActiveFilter[]> = computed(() => this.filterService.appliedFilters());

  originalProducts: Product[] = [];

  private route: ActivatedRoute = inject(ActivatedRoute);
  private productsService: ProductsService = inject(ProductsService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private filterService: FilterService = inject(FilterService);

  ngOnInit(): void {
    this.currentPages = JSON.parse(localStorage.getItem('currentPages') || '[1]');

    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params: ParamMap) => {
      const categoryParam = params.get('category')?.toUpperCase();

      if (categoryParam && Object.values(Category).includes(categoryParam as Category)) {
        if (this.category !== categoryParam) {
          this.currentPages = [1];
          localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
        }

        queueMicrotask(() => {
          this.categoryName = categoriesData[categoryParam as Category];
          this.category = categoryParam as Category;

          this.productsService.getProducts(1, this.productsPerPage, categoryParam as Category).pipe(
            switchMap((response: Response) => {
              this.productsQuantity = response.totalItems;

              const allPagesRequests = Array.from({ length: response.totalPages }, (_, i) =>
                this.productsService.getProducts(
                  i + 1,
                  this.productsPerPage,
                  categoryParam as Category,
                  null,
                  null,
                  [1, 2, 3, 4, 5]
                )
              );

              return forkJoin(allPagesRequests);
            }),
            switchMap((responses: Response[]) => {
              const allProducts = responses.flatMap(response => response.results);

              return this.productsService.getWishList().pipe(
                map((wishlistProducts: Response) => {
                  const wishlistIds = new Set(wishlistProducts.results.map(p => p.id));

                  return allProducts.map(product => ({
                    ...product,
                    isInWishlist: wishlistIds.has(product.id)
                  }));
                })
              );
            }),
            map((products: Product[]) => {
              this.originalProducts = products;
              this.filterService.initializeFilters(this.originalProducts);
              return products;
            }),
            takeUntilDestroyed(this.destroyRef)
          ).subscribe();
        });
      } else {
        this.categoryName = null;
      }
    });
  }

  applyFilters(): void {
    this.filterService.filterProducts(this.productsPerPage, this.currentPages, this.category!)
      .subscribe((response: Response) => {
        this.products = response.results;
        this.productsQuantity = response.totalItems;
        this.displayedProducts = [...response.results];
        this.filterService.applyFilters();
      });
  }

  onFiltersApply(): void {
    this.currentPages = [1];
    this.shouldResetPages = true;
    this.applyFilters();
  }

  onFilterTagRemoved(filterId: string): void {
    this.filterService.toggleFilter(filterId);

    if (filterId === 'price') {
      this.filterService.updatePriceRange(this.priceRange())
      this.priceFilter.reset();
    }

    this.shouldResetPages = true;
    this.applyFilters();
    queueMicrotask(() => {
      this.shouldResetPages = false;
    });
  }

  changeView(view: 'grid' | 'list'): void {
    this.view = view;

    localStorage.setItem('viewMode', view);
  }

  onSelectedPagesChange(pages: number[]): void {
    this.currentPages = pages;
    localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
    this.updateDisplayedProducts();
  }

  onFilterChange(type: string): void {
    this.filterService.toggleFilter(type);
  }

  onPriceRangeChange(range: Range): void {
    this.filterService.updatePriceRange(range);
  }

  onResetFilters(): void {
    this.filterService.resetAllFilters();
    this.shouldResetPages = true;
    this.applyFilters();
    this.priceFilter.reset();
    queueMicrotask(() => {
      this.shouldResetPages = false;
    });
  }

  private updateDisplayedProducts(): void {
    this.displayedProducts = [];

    const requests: Observable<Product[]>[] = this.currentPages.map(page =>
      this.productsService.getProducts(page, this.productsPerPage, this.category!).pipe(
        map((response: Response) => response.results)
      )
    );

    forkJoin(requests).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(resultsArray => {
      this.displayedProducts = resultsArray.flat();
    });
  }
}
