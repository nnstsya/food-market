import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { ReviewsComponent } from './home-page/reviews/reviews.component';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ReviewsSliderComponent } from '@home/home-page/reviews-slider/reviews-slider.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
    ReviewsComponent,
    ReviewsSliderComponent
  ],
  imports: [
    HomeRoutingModule,
    NgOptimizedImage,
    NgClass
  ]
})
export class HomeModule {}
