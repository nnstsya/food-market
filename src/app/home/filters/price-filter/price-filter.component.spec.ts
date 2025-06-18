import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceFilterComponent } from './price-filter.component';
import { RangeComponent } from '@shared/components/range/range.component';
import { SharedModule } from "@shared/shared.module";

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;

  const mockPriceRange = {
    min: 0,
    max: 100
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriceFilterComponent, RangeComponent],
      imports: [SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('priceRange', mockPriceRange);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit price range when filter changes', () => {
    const emitSpy = jest.spyOn(component.filterChanged, 'emit');
    const testRange = { min: 10, max: 50 };

    component.onPriceChange(testRange);

    expect(emitSpy).toHaveBeenCalledWith(testRange);
  });

  it('should compute min and max values from price range', () => {
    expect(component.minValue()).toBe(mockPriceRange.min);
    expect(component.maxValue()).toBe(mockPriceRange.max);
  });

  it('should reset range when reset method is called', () => {
    const resetSpy = jest.spyOn(component.range, 'resetRange');

    component.reset();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('should initialize with provided price range input', () => {
    expect(component.priceRange()).toEqual(mockPriceRange);
  });
});
