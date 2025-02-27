import { Component, inject, input, InputSignal } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ProductsService } from "@home/services/products.service";
import { Category } from "@core/models/category.model";
import { Router } from "@angular/router";
import { ShoppingCartService } from "@home/services/shopping-cart.service";

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
  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);
  private router: Router = inject(Router);

  getRatingArray(): number[] {
    return [1, 1, 1, 1, 1].fill(0, Math.floor(this.product()!.rate!), 5);
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

  navigateToProductDetail(): void {
    const product = this.product();
    const categoryName = this.getFormatedCategoryName(product.category);
    const productName = this.getFormatedProductName(product.name);

    this.router.navigate(
      ['homepage', categoryName, productName],
      { queryParams: { id: product.id } }
    );
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.product(), 1);
  }

  private getFormatedCategoryName(categoryName: string): string {
    const categoryKey = categoryName.split(' ').join('').toUpperCase() as keyof typeof Category;

    return Category[categoryKey].toLowerCase();
  }

  private getFormatedProductName(productName: string): string {
    return productName.split(' ').join('-').toLowerCase();
  }
}
