import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  id: number;
  title: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  mockCategoryData: Category[] = [
    {
      id: 1,
      title: 'Bakery'
    },
    {
      id: 2,
      title: 'Fruit and vegetables'
    },
    {
      id: 3,
      title: 'Meat and fish'
    },
    {
      id: 4,
      title: 'Drinks'
    },
    {
      id: 5,
      title: 'Kitchen'
    },
    {
      id: 6,
      title: 'Special nutrition'
    },
    {
      id: 7,
      title: 'Baby'
    },
    {
      id: 8,
      title: 'Pharmacy'
    }
  ];

  cartCount: number = 4;

  private router: Router = inject(Router);

  isHomePage: boolean = this.router.url === '/';
}
