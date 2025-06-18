import { Component, input, InputSignal } from '@angular/core';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: false
})
export class ReviewsComponent {
  reviews: InputSignal<Review[]> = input.required<Review[]>();
}
