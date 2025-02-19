import { Component, inject, OnInit } from '@angular/core';
import { ProductCart } from "@core/models/product.model";
import { ModalService } from "@shared/components/modal/modal.service";
import { ShoppingCartService } from "@home/services/shopping-cart.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit {
  products: ProductCart[] = [];
  isAuthenticated: boolean = !!localStorage.getItem('user');

  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);
  private modalService: ModalService = inject(ModalService);
  private router: Router = inject(Router)

  ngOnInit() {
    this.products = this.shoppingCartService.items();
  }

  navigateUser(): void {
    this.isAuthenticated ? this.router.navigateByUrl('/checkout') : this.modalService.showModal('login')
  }

  closeModal(): void {
    this.modalService.hideModal();
  }
}
