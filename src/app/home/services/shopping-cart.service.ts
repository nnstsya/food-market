import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Product, ProductCart } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private state: WritableSignal<ProductCart[]> = signal<ProductCart[]>(this.loadCart());

  readonly items: Signal<ProductCart[]> = computed(() => this.state());
  readonly count: Signal<number> = computed(() => this.state().reduce((total, item) => total + item.quantity, 0));

  constructor() {
    this.state.set(this.loadCart());
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.state.update((state: ProductCart[]) => {
      const existingItem: ProductCart | undefined = state.find(item =>
        item.product.id === product.id
      );

      const updatedItems: ProductCart[] = existingItem
        ? state.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        : [...state, { product, quantity }];

      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  private loadCart(): ProductCart[] {
    const stored: string | null = localStorage.getItem('shoppingCart');
    return stored ? JSON.parse(stored) : [];
  }

  private saveCart(items: ProductCart[]): void {
    localStorage.setItem('shoppingCart', JSON.stringify(items));
  }
}
