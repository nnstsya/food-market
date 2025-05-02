import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReviewsSliderComponent } from './reviews-slider.component';
import { CommonModule } from '@angular/common';
import { reviewData } from "@core/mocks/reviews";

describe('ReviewsSliderComponent', () => {
  let component: ReviewsSliderComponent;
  let fixture: ComponentFixture<ReviewsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ReviewsSliderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsSliderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reviews', reviewData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize visible reviews correctly', () => {
    expect(component.visibleReviews.length).toBe(6);
  });

  it('should go to next slide and update visibleReviews', fakeAsync(() => {
    const originalFirstReview = component.visibleReviews[0];
    component.getNext();
    tick(600);
    expect(component.visibleReviews[0]).not.toBe(originalFirstReview);
    expect(component.slideDirection).toBe('');
    expect(component.isTransitioning).toBe(false);
  }));

  it('should go to previous slide and update visibleReviews', fakeAsync(() => {
    const originalFirstReview = component.visibleReviews[0];
    component.getPrev();
    tick(600);
    expect(component.visibleReviews[0]).not.toBe(originalFirstReview);
    expect(component.slideDirection).toBe('');
    expect(component.isTransitioning).toBe(false);
  }));

  it('should not transition if already transitioning', () => {
    component.isTransitioning = true;
    const spy = jest.spyOn(component, 'updateSlides');
    component.getNext();
    component.getPrev();
    expect(spy).not.toHaveBeenCalled();
  });
});
