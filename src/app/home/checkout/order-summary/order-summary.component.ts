import { Component, effect, inject } from '@angular/core';
import { ProductCart } from "@core/models/product.model";
import { ShoppingCartService } from "@home/services/shopping-cart.service";

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
  standalone: false
})
export class OrderSummaryComponent {
  products: ProductCart[] = [];
  totalPrice: number = 0;

  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  constructor() {
    effect(() => {
      this.products = this.shoppingCartService.items();
      this.totalPrice = this.shoppingCartService.total();
    });
  }
}
