import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category, CategoryItem } from '@core/models/category.model';
import { categoryData } from '@core/mocks/categories';
import { ModalService } from "@shared/components/modal/modal.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartCount: number = 4;
  isHomePage: boolean;
  isAuthenticated: boolean = !!localStorage.getItem('user');
  categories: CategoryItem[] = categoryData;

  private router: Router = inject(Router);
  private modalService: ModalService = inject(ModalService);

  constructor() {
    this.isHomePage = this.router.url === '/'
  }

  navigateUser(): void {
    this.isAuthenticated ? this.router.navigateByUrl('/account') : this.modalService.showModal('login');
  }

  getCategoryName(title: string): string {
    const categoryKey = title.split(' ').join('').toUpperCase() as keyof typeof Category;

    return Category[categoryKey].toLowerCase();
  }

  checkIfTabActive(title: string) {
    return this.router.url.split('/').includes(title.split(' ').join('').toLowerCase());
  }
}
