import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { ReviewsComponent } from './home-page/reviews/reviews.component';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ReviewsSliderComponent } from '@home/home-page/reviews-slider/reviews-slider.component';
import { SharedModule } from '@shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { RatingFilterComponent } from './filters/rating-filter/rating-filter.component';
import { PriceFilterComponent } from './filters/price-filter/price-filter.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    ReviewsComponent,
    ReviewsSliderComponent,
    CategoryComponent,
    RatingFilterComponent,
    PriceFilterComponent
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    NgOptimizedImage,
    NgClass,
    AsyncPipe
  ]
})
export class HomeModule {}
