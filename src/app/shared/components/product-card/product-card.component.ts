import { Component, inject, input, InputSignal } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ProductsService } from "@home/services/products.service";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product: InputSignal<Product> = input.required<Product>();
  showRate: InputSignal<boolean> = input<boolean>(true);
  type: InputSignal<'vertical' | 'horizontal'> = input<'vertical' | 'horizontal'>('vertical');

  private productService: ProductsService = inject(ProductsService);

  getRatingArray(): number[] {
    return [1, 1, 1, 1, 1].fill(0, Math.floor(this.product()!.rating!), 5);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/image-placeholder.jpg';
  }

  getFreshness(days: number): string {
    if (days < 4) {
      return 'New (Extra Fresh)';
    } else if (days < 8) {
      return 'Fresh';
    } else if (days < 30) {
      return 'Moderately Fresh';
    } else if (days < 180) {
      return 'Long Lasting Freshness';
    } else {
      return 'Preserved Freshness';
    }
  }

  addToWishList(product: Product): void {
    this.productService.addToWishList(product);
  }

  removeFromWishList(product: Product): void {
    this.productService.removeFromWishList(product);
  }

  checkIfInWishList(product: Product): boolean {
    return this.productService.getWishList().some((wishListProduct: Product) => product.id === wishListProduct.id);
  }
}
