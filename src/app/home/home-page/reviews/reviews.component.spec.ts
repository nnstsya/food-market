import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsComponent } from './reviews.component';
import { CommonModule } from '@angular/common';
import { reviewData } from "@core/mocks/reviews";

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ReviewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reviews', reviewData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all reviews', () => {
    const reviewElements = fixture.nativeElement.querySelectorAll('.reviews__slide');
    expect(reviewElements.length).toBe(reviewData.length);
    expect(reviewElements[0].textContent).toContain('An incredible variety of fresh');
    expect(reviewElements[1].textContent).toContain('This food market is a hidden gem!');
    expect(reviewElements[2].textContent).toContain('The selection here is unbeatable!');
  });

  it('should display author and avatar correctly', () => {
    const authors = fixture.nativeElement.querySelectorAll('.reviews__slide__author');
    const avatars = fixture.nativeElement.querySelectorAll('.reviews__slide__avatar-img');

    authors.forEach((el: HTMLElement, index: number) => {
      expect(el.textContent).toBe(reviewData[index].author);
    });

    avatars.forEach((img: HTMLImageElement, index: number) => {
      expect(img.src).toContain(reviewData[index].avatar);
      expect(img.alt).toBe(`Avatar of ${reviewData[index].author}`);
    });
  });
});
