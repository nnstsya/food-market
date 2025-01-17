import { Component } from '@angular/core';
import { Review } from '@core/models/review.model';
import { reviewData } from '@core/mocks/reviews';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  reviews: Review[] = reviewData;
}
