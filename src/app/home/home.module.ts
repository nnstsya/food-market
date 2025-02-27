import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { ReviewsComponent } from './home-page/reviews/reviews.component';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ReviewsSliderComponent } from '@home/home-page/reviews-slider/reviews-slider.component';
import { SharedModule } from '@shared/shared.module';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    ReviewsComponent,
    ReviewsSliderComponent,
    CategoryComponent
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
