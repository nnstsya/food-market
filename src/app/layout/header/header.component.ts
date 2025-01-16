import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '@core/models/category.model';
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
  categories: Category[] = categoryData;
  isAuthenticated: boolean = !!localStorage.getItem('user');

  private router: Router = inject(Router);
  private modalService: ModalService = inject(ModalService);

  constructor() {
    this.isHomePage = this.router.url === '/'
  }

  navigateUser(): void {
    this.isAuthenticated ? this.router.navigateByUrl('/account') : this.modalService.showModal('login');
  }
}
