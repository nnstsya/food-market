import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { BuyBy, Product, ProductCart } from "@core/models/product.model";
import { buyByOptions } from "@core/mocks/products";
import { Option } from "@shared/components/dropdown/dropdown.component";
import { ProductsService } from "@home/services/products.service";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit {
  product: InputSignal<ProductCart> = input.required<ProductCart>();
  buyByOptions: Option[] = buyByOptions;

  private productsService: ProductsService = inject(ProductsService);

  ngOnInit() {
    this.updateBuyByOptions();
  }

  getRatingArray(): number[] {
    return [1, 1, 1, 1, 1].fill(0, Math.floor(this.product()!.product.rate!), 5);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/image-placeholder.jpg';
  }

  addToWishList(product: Product): void {
    this.productsService.addToWishList(product);
  }

  removeFromWishList(product: Product): void {
    this.productsService.removeFromWishList(product);
  }

  checkIfInWishList(product: Product): boolean {
    return this.productsService.getWishList().some((wishListProduct: Product) => product.id === wishListProduct.id);
  }

  private updateBuyByOptions(): void {
    this.buyByOptions = buyByOptions.filter(option =>
      this.product().product.buyBy.some(buyBy =>
        Object.entries(BuyBy).some(([key, value]) =>
          key === buyBy && value === option.title
        )
      )
    ).filter((option, index, self) =>
      self.findIndex(o => o.title === option.title) === index
    );
  }
}
