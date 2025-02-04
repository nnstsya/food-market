import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  viewChild,
  computed
} from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Category } from "@core/models/category.model";
import { categoriesData } from "@core/mocks/categories";
import { map } from "rxjs";
import { Product } from "@core/models/product.model";
import { ProductsService } from "@home/services/products.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RangeComponent } from "@shared/components/range/range.component";
import { FilterService } from "@home/services/filter.service";
import { ActiveFilter, FilterValue, PriceRange, RatingCheckbox } from "@home/models/filter.model";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  rangeComponent: Signal<RangeComponent> = viewChild.required<RangeComponent>('rangeComponent');

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

  private originalProducts: Product[] = [];

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
      }
    });
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
      this.rangeComponent().resetRange();
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

  onFilterChange(type: string) {
    this.filterService.toggleFilter(type);
  }

  onPriceRangeChange(range: {min: number; max: number}) {
    this.filterService.updatePriceRange(range);
  }

  onResetFilters(): void {
    this.rangeComponent().resetRange();
    this.filterService.resetAllFilters();
    this.applyFilters();
  }

  private updateDisplayedProducts(): void {
    this.displayedProducts = this.currentPages.reduce((acc: Product[], page: number): Product[] => {
      const startIndex: number = (page - 1) * this.productsPerPage;
      const endIndex: number = startIndex + this.productsPerPage;
      return acc.concat(this.products.slice(startIndex, endIndex));
    }, []);
  }
}
