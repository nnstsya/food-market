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
      const categoryParam = params.get('category')?.toUpperCase() as keyof typeof Category;

      if (categoryParam && Category[categoryParam]) {
        if (this.category !== Category[categoryParam]) {
          this.currentPages = [1];
          localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
        }

        this.categoryName = categoriesData[Category[categoryParam]];
        this.category = Category[categoryParam];

        if (this.currentPages.length !== 1) {
          for (let page of this.currentPages) {
            this.productsService.getProductsByCategory(this.category!, page, this.productsPerPage).pipe(
              map((response: Response) => {
                this.originalProducts.push(...response.results);
                this.filterService.initializeFilters(this.originalProducts);
                this.applyFilters();
                this.productsQuantity = response.totalItems;
                return response;
              }),
              takeUntilDestroyed(this.destroyRef)
            ).subscribe();
          }
        } else {
          this.productsService.getProductsByCategory(this.category!, this.currentPages[0], this.productsPerPage).pipe(
            map((response: Response) => {
              this.originalProducts = response.results;
              this.filterService.initializeFilters(response.results);
              this.applyFilters();
              this.productsQuantity = response.totalItems;
              return response;
            }),
            takeUntilDestroyed(this.destroyRef)
          ).subscribe();
        }

      } else {
        this.categoryName = null;
      }
    });
  }

  applyFilters(): void {
    this.products = this.filterService.filterProducts(this.originalProducts);
    this.productsQuantity = this.products.length;

    this.filterService.applyFilters();
    this.updateDisplayedProducts();
  }

  onFiltersApply(): void {
    this.currentPages = [1];
    this.applyFilters();
  }

  onFilterTagRemoved(filterId: string): void {
    this.filterService.toggleFilter(filterId);

    if (filterId === 'price') {
      this.filterService.updatePriceRange(this.priceRange())
      this.priceFilter.reset();
    }

    this.applyFilters();
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
    this.applyFilters();
    this.priceFilter.reset();
  }

  private updateDisplayedProducts(): void {
    this.displayedProducts = [];

    const requests: Observable<Product[]>[] = this.currentPages.map(page =>
      this.productsService.getProductsByCategory(this.category!, page, this.productsPerPage).pipe(
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
