import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from "@home/services/products.service";
import { Product, Response } from "@core/models/product.model";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, of, switchMap } from "rxjs";

@Component({
  selector: 'app-product-recommendations',
  templateUrl: './product-recommendations.component.html',
  styleUrl: './product-recommendations.component.scss'
})
export class ProductRecommendationsComponent implements OnInit {
  recommendedProducts$: Observable<Product[]> = of([]);

  private productService: ProductsService = inject(ProductsService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.recommendedProducts$ = this.route.queryParamMap.pipe(
      map(params => params.get('id')!),
      switchMap((currentProductId: string) => this.loadRecommendations(currentProductId))
    );
  }

  private loadRecommendations(currentProductId: string): Observable<Product[]> {
    return this.productService.getProducts().pipe(
      map((res: Response) => {
        const filteredProducts = res.results.filter((p: Product) => p.id !== currentProductId);
        return this.getRandomProducts(filteredProducts, 4);
      })
    );
  }

  private getRandomProducts(products: Product[], count: number): Product[] {
    return products
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }
}
