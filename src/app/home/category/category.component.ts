import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  computed,
  ViewChild, OnDestroy
} from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Category } from "@core/models/category.model";
import { categoriesData } from "@core/mocks/categories";
import { map } from "rxjs";
import { Product } from "@core/models/product.model";
import { ProductsService } from "@home/services/products.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FilterService } from "@home/services/filter.service";
import { ActiveFilter, FilterValue, PriceRange, RatingCheckbox } from "@home/models/filter.model";
import { PriceFilterComponent } from "@home/filters/price-filter/price-filter.component";

type Range = { min: number; max: number };

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit, OnDestroy {
  @ViewChild(PriceFilterComponent) priceFilter!: PriceFilterComponent;

  categoryName: string | null = null;
  productsQuantity: number = 0;
  view: 'list' | 'grid' = <'list' | 'grid'>localStorage.getItem('viewMode') || 'grid';
  productsPerPage: number = 5;
  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentPages: number[] = JSON.parse(localStorage.getItem('currentPages') || '[1]');

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
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params: ParamMap) => {
      const categoryParam = params.get('category')?.toUpperCase() as keyof typeof Category;

      if (categoryParam && Category[categoryParam]) {
        this.categoryName = categoriesData[Category[categoryParam]];

        this.productsService.getProductsByCategory(Category[categoryParam]).pipe(
          map((products: Product[]) => {
            this.originalProducts = products;
            this.filterService.initializeFilters(products);
            this.applyFilters();
            return products;
          }),
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
      } else {
        this.categoryName = null;
      }
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('currentPages');
  }

  applyFilters(): void {
    this.products = this.filterService.filterProducts(this.originalProducts);
    this.currentPages = [1];
    this.productsQuantity = this.products.length;

    this.filterService.applyFilters();
    this.updateDisplayedProducts();
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
    this.displayedProducts = this.currentPages.reduce((acc: Product[], page: number): Product[] => {
      const startIndex: number = (page - 1) * this.productsPerPage;
      const endIndex: number = startIndex + this.productsPerPage;
      return acc.concat(this.products.slice(startIndex, endIndex));
    }, []);
  }
}
