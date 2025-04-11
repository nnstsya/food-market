import { Component, input, InputSignal, OnInit } from '@angular/core';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-reviews-slider',
  templateUrl: './reviews-slider.component.html',
  styleUrls: ['./reviews-slider.component.scss'],
  standalone: false
})
export class ReviewsSliderComponent implements OnInit {
  reviews: InputSignal<Review[]> = input.required<Review[]>();

  visibleReviews: Review[] = [];
  reviewIndex: number = 0;
  slideDirection: string = '';
  isTransitioning: boolean = false;

  ngOnInit() {
    this.updateSlides();
  }

  updateSlides() {
    const length: number = this.reviews().length;
    const visibleSlideCount = 6;

    const indices: number[] = Array.from({ length: visibleSlideCount }, (_, i) => {
      const offset: number = i - Math.floor(visibleSlideCount / 3);
      return (this.reviewIndex + offset + length) % length;
    });

    this.visibleReviews = indices.map(index => this.reviews()[index]);

    this.slideDirection = '';
    this.isTransitioning = false;
  }

  getPrev() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.reviewIndex = (this.reviewIndex - 1 + this.reviews().length) % this.reviews().length;
    this.slideDirection = 'prev';

    setTimeout(() => {
      this.updateSlides();
    }, 600);
  }

  getNext() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.reviewIndex = (this.reviewIndex + 1) % this.reviews().length;
    this.slideDirection = 'next';

    setTimeout(() => {
      this.updateSlides();
    }, 600);
  }
}
