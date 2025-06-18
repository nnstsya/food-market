import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeComponent } from './range.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';

describe('RangeComponent', () => {
  let component: RangeComponent;
  let fixture: ComponentFixture<RangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RangeComponent, InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RangeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('step', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.minValue).toBe(0);
    expect(component.maxValue).toBe(100);
    expect(component.minInputValue).toBe(0);
    expect(component.maxInputValue).toBe(100);
  });

  it('should calculate track position correctly', () => {
    component.minValue = 20;
    component.maxValue = 80;

    expect(component.trackLeft).toBe(20);
    expect(component.trackWidth).toBe(60);
  });

  it('should handle min input changes', () => {
    const emitSpy = jest.spyOn(component.rangeChange, 'emit');
    component.minInputValue = 30;
    component.handleInputChange('min');

    expect(component.minValue).toBe(30);
    expect(emitSpy).toHaveBeenCalledWith({ min: 30, max: 100 });
  });

  it('should handle max input changes', () => {
    const emitSpy = jest.spyOn(component.rangeChange, 'emit');
    component.maxInputValue = 70;
    component.handleInputChange('max');

    expect(component.maxValue).toBe(70);
    expect(emitSpy).toHaveBeenCalledWith({ min: 0, max: 70 });
  });

  it('should validate range when min exceeds max', () => {
    component.minValue = 80;
    component.maxValue = 70;
    component.validateRange('min');

    expect(component.minValue).toBe(69);
  });

  it('should validate range when max is less than min', () => {
    component.minValue = 60;
    component.maxValue = 50;
    component.validateRange('max');

    expect(component.maxValue).toBe(61);
  });

  it('should handle slider input events', () => {
    const mockEvent = { target: { value: '45' } } as any;
    const emitSpy = jest.spyOn(component.rangeChange, 'emit');

    component.handleSliderInput(mockEvent, 'min');

    expect(component.minValue).toBe(45);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle invalid slider input values', () => {
    const mockEventNaN = { target: { value: 'not-a-number' } } as any;
    const initialMaxValue = component.maxValue;

    component.handleSliderInput(mockEventNaN, 'max');
    expect(component.maxValue).toBe(initialMaxValue);
  });

  it('should handle slider input for both min and max values', () => {
    const emitSpy = jest.spyOn(component.rangeChange, 'emit');

    const mockMinEvent = { target: { value: '30' } } as any;
    component.handleSliderInput(mockMinEvent, 'min');
    expect(component.minValue).toBe(30);
    expect(emitSpy).toHaveBeenCalledWith({ min: 30, max: 100 });

    const mockMaxEvent = { target: { value: '70' } } as any;
    component.handleSliderInput(mockMaxEvent, 'max');
    expect(component.maxValue).toBe(70);
    expect(emitSpy).toHaveBeenCalledWith({ min: 30, max: 70 });
  });

  it('should reset range when min/max inputs change', () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 90);
    fixture.detectChanges();

    expect(component.minValue).toBe(10);
    expect(component.maxValue).toBe(90);
  });

  it('should calculate slider widths correctly', () => {
    component.minValue = 20;
    component.maxValue = 80;

    expect(component.minSliderWidth).toBe(79.05);
    expect(component.maxSliderWidth).toBe(79.05);
  });

  it('should calculate minimum slider width for edge case when step equals range', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 1);
    fixture.componentRef.setInput('step', 1);
    component.minValue = 0;
    component.maxValue = 1;
    fixture.detectChanges();

    expect(component.maxSliderWidth).toBe(7.2);
  });

  it('should round min value down when validating range', () => {
    component.minValue = 45.7;
    component.maxValue = 80;
    component.validateRange('min');

    expect(component.minValue).toBe(45);
    expect(component.minInputValue).toBe(45);
  });

  it('should round max value up when validating range', () => {
    component.maxValue = 75.3;
    component.minValue = 50;
    component.validateRange('max');

    expect(component.maxValue).toBe(76);
    expect(component.maxInputValue).toBe(76);
  });

  it('should handle initial range reset with same min and max values', () => {
    fixture.componentRef.setInput('min', 50);
    fixture.componentRef.setInput('max', 50);
    fixture.detectChanges();

    component.resetRange();

    expect(component.minValue).toBe(50);
    expect(component.maxValue).toBe(50);
    expect(component.minInputValue).toBe(50);
    expect(component.maxInputValue).toBe(50);
  });

  it('should handle min value below component minimum', () => {
    component.minValue = -10;
    component.validateRange('min');

    expect(component.minValue).toBe(component.min());
    expect(component.minInputValue).toBe(component.min());
  });

  it('should handle max value above component maximum', () => {
    component.maxValue = 150;
    component.validateRange('max');

    expect(component.maxValue).toBe(component.max());
    expect(component.maxInputValue).toBe(component.max());
  });

  it('should reset range with different min/max values', () => {
    const emitSpy = jest.spyOn(component.rangeChange, 'emit');
    fixture.componentRef.setInput('min', 20);
    fixture.componentRef.setInput('max', 80);
    fixture.detectChanges();

    component.resetRange();

    expect(component.minValue).toBe(20);
    expect(component.maxValue).toBe(80);
    expect(component.minInputValue).toBe(20);
    expect(component.maxInputValue).toBe(80);
    expect(emitSpy).toHaveBeenCalledWith({ min: 20, max: 80 });
  });
});

