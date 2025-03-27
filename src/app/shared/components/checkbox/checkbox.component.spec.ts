import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import { FormsModule } from '@angular/forms';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isChecked from input checked', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(component.isChecked).toBe(true);
  });

  it('should toggle checked state and call emit, onChange, onTouched', () => {
    const emitSpy: jest.SpyInstance = jest.spyOn(component.changed, 'emit');
    const onChangeSpy = jest.fn();
    const onTouchedSpy = jest.fn();

    component.registerOnChange(onChangeSpy);
    component.registerOnTouched(onTouchedSpy);
    fixture.componentRef.setInput('disabled', false);
    component.isChecked = false;

    component.toggleCheck();

    expect(component.isChecked).toBe(true);
    expect(onChangeSpy).toHaveBeenCalledWith(true);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should not toggle if disabled is true', () => {
    const emitSpy: jest.SpyInstance = jest.spyOn(component.changed, 'emit');
    fixture.componentRef.setInput('disabled', true);
    component.isChecked = false;

    component.toggleCheck();

    expect(component.isChecked).toBe(false);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  describe('ControlValueAccessor implementation', () => {
    it('should handle null/undefined value in writeValue', () => {
      component.writeValue(null as any);
      expect(component.isChecked).toBe(false);

      component.writeValue(undefined as any);
      expect(component.isChecked).toBe(false);
    });

    it('should call onChange when value changes through toggleCheck', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      component.isChecked = false;
      component.toggleCheck();

      expect(onChangeSpy).toHaveBeenCalledWith(true);
      expect(component.isChecked).toBe(true);
    });

    it('should call onTouched when value changes through toggleCheck', () => {
      const onTouchedSpy = jest.fn();
      component.registerOnTouched(onTouchedSpy);

      component.toggleCheck();

      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should not call onChange or onTouched when disabled', () => {
      const onChangeSpy = jest.fn();
      const onTouchedSpy = jest.fn();

      component.registerOnChange(onChangeSpy);
      component.registerOnTouched(onTouchedSpy);
      fixture.componentRef.setInput('disabled', true);

      component.toggleCheck();

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(onTouchedSpy).not.toHaveBeenCalled();
    });
  });
});
