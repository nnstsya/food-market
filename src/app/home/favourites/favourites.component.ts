import {
  Component,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { ProductsService } from '@home/services/products.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product, Response } from '@core/models/product.model';
import { forkJoin, map, Observable } from 'rxjs';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  standalone: false
})
export class FavouritesComponent implements OnInit {
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  products: Product[] = [];
  displayedProducts: Product[] = [];

  productsPerPage: number = 8;
  productsQuantity: number = 0;
  currentPages: number[] = JSON.parse(localStorage.getItem('currentPages') || '[1]');
  shouldResetPages = false;

  view: 'list' | 'grid' = <'list' | 'grid'>localStorage.getItem('viewMode') || 'grid';

  ngOnInit(): void {
    this.loadFavoriteProducts();
  }

  loadFavoriteProducts(): void {
    this.productsService.getWishList().pipe(
      takeUntilDestroyed(this.destroyRef),
      map((response: Response) => {
        this.products = response.results;
        this.productsQuantity = this.products.length;
        this.updateDisplayedProducts();
      })
    ).subscribe({
      error: () => this.toastService.show('Failed to load favorite products')
    });
  }

  updateDisplayedProducts(): void {
    this.displayedProducts = [];

    const requests: Observable<Product[]>[] = this.currentPages.map(page => {
      const startIndex = (page - 1) * this.productsPerPage;
      const endIndex = startIndex + this.productsPerPage;
      return new Observable<Product[]>(observer => {
        observer.next(this.products.slice(startIndex, endIndex));
        observer.complete();
      });
    });

    forkJoin(requests).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(resultsArray => {
      this.displayedProducts = resultsArray.flat();
    });
  }

  changeView(view: 'grid' | 'list'): void {
    this.view = view;
    localStorage.setItem('viewMode', view);
  }

  onSelectedPagesChange(pages: number[]): void {
    this.currentPages = pages;
    localStorage.setItem('currentPages', JSON.stringify(pages));
    this.updateDisplayedProducts();
  }
}
