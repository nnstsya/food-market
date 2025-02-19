import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryItem } from '@core/models/category.model';
import { categoryData } from '@core/mocks/categories';
import { ModalService } from "@shared/components/modal/modal.service";
import { ShoppingCartService } from "@home/services/shopping-cart.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartCount: number = 0;
  isHomePage: boolean;
  categories: CategoryItem[] = categoryData;

  private router: Router = inject(Router);
  private modalService: ModalService = inject(ModalService);
  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  constructor() {
    this.isHomePage = this.router.url === '/'

    effect(() => {
      this.cartCount = this.shoppingCartService.count();
    });
  }

  openShoppingCart(): void {
    this.modalService.showModal('cart');
  }
}
