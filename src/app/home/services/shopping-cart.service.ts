import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Product, ProductCart } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private state: WritableSignal<ProductCart[]> = signal<ProductCart[]>(this.loadCart());

  readonly items: Signal<ProductCart[]> = computed(() => this.state());
  readonly count: Signal<number> = computed(() => this.state().reduce((total, item) => total + item.quantity, 0));
  readonly total: Signal<number> = computed(() =>
    this.state().reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    )
  );

  constructor() {
    this.state.set(this.loadCart());
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.state.update((state: ProductCart[]) => {
      const existingItem: ProductCart | undefined = state.find(item => item.product.id === product.id);
      const normalizedQuantity = Math.min(quantity, product.maxKgs);

      if (existingItem) {
        const newItems = state.map(item => {
          if (item.product.id === product.id) {
            const newQuantity = Math.min(item.quantity + normalizedQuantity, product.maxKgs);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        this.saveCart(newItems);
        return newItems;
      }

      const newItems: ProductCart[] = [...state, { product, quantity: normalizedQuantity }];
      this.saveCart(newItems);
      return newItems;
    });
  }

  removeFromCart(productId: string): void {
    this.state.update((state: ProductCart[]) => {
      const updatedItems: ProductCart[] = state.filter(item =>
        item.product.id !== productId
      );
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  updateQuantity(productId: string, quantity: number, maxKgs: number): void {
    if (quantity < 1) return;
    const normalizedQuantity = Math.min(quantity, maxKgs);

    this.state.update(state => {
      const updatedItems = state.map(item =>
        item.product.id === productId
          ? { ...item, quantity: normalizedQuantity }
          : item
      );
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  canIncreaseQuantity(productId: string, increment: number = 1): boolean {
    const item = this.items().find(item => item.product.id === productId);
    if (!item) return true;
    return (item.quantity + increment) <= item.product.maxKgs;
  }

  private loadCart(): ProductCart[] {
    const stored: string | null = localStorage.getItem('shoppingCart');
    return stored ? JSON.parse(stored) : [];
  }

  private saveCart(items: ProductCart[]): void {
    localStorage.setItem('shoppingCart', JSON.stringify(items));
  }
}
