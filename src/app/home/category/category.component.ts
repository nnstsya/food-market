import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Category } from "@core/models/category.model";
import { categoriesData } from "@core/mocks/categories";
import { map, Observable, of } from "rxjs";
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
  products$: Observable<Product[]> = of([]);

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

        this.products$ = this.productsService.getProductsByCategory(Category[categoryParam]).pipe(
          map((products: Product[]) => {
            this.productsQuantity = products.length;
            return products;
          })
        );
      } else {
        this.categoryName = null;
      }
    });
  }
}
