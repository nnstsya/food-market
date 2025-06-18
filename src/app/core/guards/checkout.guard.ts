import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ShoppingCartService } from "@home/services/shopping-cart.service";

export function checkoutGuard(): CanActivateFn {
  return () => {
    const router: Router = inject(Router);
    const shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

    const productsInTheCard: boolean = !!shoppingCartService.items().length;

    return productsInTheCard || router.navigateByUrl('/home');
  };
}
