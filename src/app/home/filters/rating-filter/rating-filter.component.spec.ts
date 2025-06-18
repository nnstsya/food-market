import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingFilterComponent } from './rating-filter.component';
import { SharedModule } from "@shared/shared.module";

describe('RatingFilterComponent', () => {
  let component: RatingFilterComponent;
  let fixture: ComponentFixture<RatingFilterComponent>;

  const mockRatings = [
    { id: '5', checked: false, count: '10', ratingArray: [1, 1, 1, 1, 1] },
    { id: '4', checked: false, count: '15', ratingArray: [1, 1, 1, 1, 0] },
    { id: '3', checked: false, count: '8', ratingArray: [1, 1, 1, 0, 0] }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingFilterComponent],
      imports: [SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ratings', mockRatings);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit rating id when filter changes', () => {
    const emitSpy = jest.spyOn(component.filterChanged, 'emit');
    const testRatingId = '5';

    component.onFilterChange(testRatingId);

    expect(emitSpy).toHaveBeenCalledWith(testRatingId);
  });

  it('should initialize with provided ratings input', () => {
    expect(component.ratings()).toEqual(mockRatings);
  });
});
