import { Component, inject, Signal } from '@angular/core';
import { ProductCart } from "@core/models/product.model";
import { ModalService } from "@shared/components/modal/modal.service";
import { ShoppingCartService } from "@home/services/shopping-cart.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  standalone: false
})
export class ShoppingCartComponent {
  readonly products: Signal<ProductCart[]>;
  readonly totalPrice: Signal<number>;
  isAuthenticated: boolean = !!localStorage.getItem('user');

  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);
  private modalService: ModalService = inject(ModalService);
  private router: Router = inject(Router)

  constructor() {
    this.products = this.shoppingCartService.items;
    this.totalPrice = this.shoppingCartService.total;
  }

  navigateUser(): void {
    this.modalService.hideModal();
    this.isAuthenticated ? this.router.navigateByUrl('homepage/checkout') : this.modalService.showModal('login')
  }

  closeModal(): void {
    this.modalService.hideModal();
  }
}
