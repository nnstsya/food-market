import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CategoryComponent } from "@home/category/category.component";
import { ProductDetailComponent } from "@home/product-detail/product-detail.component";
import { CheckoutComponent } from "@home/checkout/checkout.component";
import { authGuard } from "@core/guards/auth.guard";
import { checkoutGuard } from "@core/guards/checkout.guard";
import { FavouritesComponent } from "@home/favourites/favourites.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'favourites',
        component: FavouritesComponent,
      },
      {
        path: 'homepage',
        component: HomePageComponent,
      },
      {
        path: 'homepage/checkout',
        component: CheckoutComponent,
        canActivate: [authGuard(), checkoutGuard()],
      },
      {
        path: 'homepage/:category/:product',
        component: ProductDetailComponent
      },
      {
        path: 'homepage/:category',
        component: CategoryComponent
      },
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
