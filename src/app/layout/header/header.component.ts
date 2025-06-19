import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, CategoryItem } from '@core/models/category.model';
import { categoryData } from '@core/mocks/categories';
import { ModalService } from "@shared/components/modal/modal.service";
import { ShoppingCartService } from "@home/services/shopping-cart.service";
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  isHomePage: boolean;
  categories: CategoryItem[] = categoryData;
  isAuthenticated: boolean = false;

  private router: Router = inject(Router);
  private modalService: ModalService = inject(ModalService);
  private shoppingCartService: ShoppingCartService = inject(ShoppingCartService);
  private authService: AuthService = inject(AuthService);

  constructor() {
    this.isHomePage = this.router.url === '/'

    effect(() => {
      this.cartCount = this.shoppingCartService.count();
    });
  }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
  }

  openShoppingCart(): void {
    this.modalService.showModal('cart');
  }

  navigateUser(): void {
    this.isAuthenticated ? this.router.navigateByUrl('/profile') : this.modalService.showModal('login');
  }

  getCategoryName(title: string): string {
    const categoryKey = title.split(' ').join('').toUpperCase() as keyof typeof Category;

    return Category[categoryKey].toLowerCase();
  }

  checkIfTabActive(title: string) {
    return this.router.url.split('/').includes(title.split(' ').join('').toLowerCase());
  }
}
