import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from "@home/services/products.service";
import { Product } from "@core/models/product.model";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, of } from "rxjs";

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
    const currentProductId: string = this.route.snapshot.queryParamMap.get('id')!;
    this.loadRecommendations(currentProductId);
  }

  private loadRecommendations(currentProductId: string): void {
    this.recommendedProducts$ = this.productService.getProducts().pipe(
      map((products: Product[]): Product[] => {
        const filteredProducts: Product[] = products.filter((p: Product) => p.id !== currentProductId);
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
