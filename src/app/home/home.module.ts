import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { ReviewsComponent } from './home-page/reviews/reviews.component';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ReviewsSliderComponent } from '@home/home-page/reviews-slider/reviews-slider.component';
import { SharedModule } from '@shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductItemComponent } from './shopping-cart/product-item/product-item.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    ReviewsComponent,
    ReviewsSliderComponent,
    CategoryComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    ProductItemComponent
  ],
  exports: [
    ShoppingCartComponent
  ],
  imports: [
    HomeRoutingModule,
    NgOptimizedImage,
    AsyncPipe,
    SharedModule,
    NgClass,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HomeModule {}
