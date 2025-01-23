import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Category } from "@core/models/category.model";
import { categoriesData } from "@core/mocks/categories";
import { map } from "rxjs";
import { Product } from "@core/models/product.model";
import { ProductsService } from "@home/services/products.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categoryName: string | null = null;
  productsQuantity: number = 0;
  view: 'list' | 'grid' = <'list' | 'grid'>localStorage.getItem('viewMode') || 'grid';
  productsPerPage: number = 5;

  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentPages: number[] = JSON.parse(localStorage.getItem('currentPages') || '[1]'); // Load from localStorage

  private route: ActivatedRoute = inject(ActivatedRoute);
  private productsService: ProductsService = inject(ProductsService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((params: ParamMap) => {
      const categoryParam = params.get('category')?.toUpperCase() as keyof typeof Category;

      if (categoryParam && Category[categoryParam]) {
        this.categoryName = categoriesData[Category[categoryParam]];

        this.productsService.getProductsByCategory(Category[categoryParam]).pipe(
          map((products: Product[]) => {
            this.productsQuantity = products.length;
            this.products = products;
            this.updateDisplayedProducts();
            return products;
          }),
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
      } else {
        this.categoryName = null;
      }
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

  private updateDisplayedProducts(): void {
    this.displayedProducts = this.currentPages.reduce((acc: Product[], page: number): Product[] => {
      const startIndex: number = (page - 1) * this.productsPerPage;
      const endIndex: number = startIndex + this.productsPerPage;
      return acc.concat(this.products.slice(startIndex, endIndex));
    }, []);
  }
}
