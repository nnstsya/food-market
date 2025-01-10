import { Component, input, InputSignal } from '@angular/core';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product: InputSignal<Product> = input.required<Product>();

  getRatingArray(): number[] {
    return [1, 1, 1, 1, 1].fill(0, Math.floor(this.product().rating!), 5);
  }
}
