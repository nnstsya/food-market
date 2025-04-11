import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { BuyBy, Product, ProductCart } from "@core/models/product.model";
import { buyByOptions } from "@core/mocks/products";
import { Option } from "@shared/components/dropdown/dropdown.component";
import { ProductsService } from "@home/services/products.service";
import { ShoppingCartService } from "@home/services/shopping-cart.service";
import { Category } from "@core/models/category.model";
import { Router } from "@angular/router";
import { ModalService } from "@shared/components/modal/modal.service";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  standalone: false
})
export class ProductItemComponent implements OnInit {
  product: InputSignal<ProductCart> = input.required<ProductCart>();
  buyByOptions: Option[] = buyByOptions;

  private productsService: ProductsService = inject(ProductsService);
  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);
  private router: Router = inject(Router);
  private modalService: ModalService = inject(ModalService);

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

  removeFromCart(): void {
    this.shoppingCartService.removeFromCart(this.product().product.id);
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = Number(input.value);
    const maxKgs = this.product().product.maxKgs;

    if (!isNaN(quantity)) {
      if (quantity > maxKgs) {
        input.value = maxKgs.toString();
        this.shoppingCartService.updateQuantity(
            this.product().product.id,
            maxKgs,
            maxKgs
        );
      } else {
        this.shoppingCartService.updateQuantity(
            this.product().product.id,
            quantity,
            maxKgs
        );
      }
    }
  }

  navigateToProductDetail(product: Product): void {
    const categoryName = this.getFormatedCategoryName(product.category);
    const productName = this.getFormatedProductName(product.name);

    this.router.navigate(
        ['homepage', categoryName, productName],
        { queryParams: { id: product.id } }
    );

    this.modalService.hideModal();
  }

  private getFormatedCategoryName(categoryName: string): string {
    const categoryKey = categoryName.split(' ').join('').toUpperCase() as keyof typeof Category;

    return Category[categoryKey].toLowerCase();
  }

  private getFormatedProductName(productName: string): string {
    return productName.split(' ').join('-').toLowerCase();
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
