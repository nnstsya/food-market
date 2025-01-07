import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '@core/models/category.model';
import { categoryData } from '@core/mocks/categories';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartCount: number = 4;
  isHomePage: boolean;
  categories: Category[] = categoryData;

  private router: Router = inject(Router);

  constructor() {
    this.isHomePage = this.router.url === '/'
  }
}
