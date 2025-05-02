import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './input.component';
import { NgOptimizedImage } from '@angular/common';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [FormsModule, NgOptimizedImage]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('placeholder', 'Test placeholder');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for inputs', () => {
    expect(component.label()).toBe('');
    expect(component.iconUrl()).toBe('');
    expect(component.border()).toBe(true);
    expect(component.errorState()).toBe(false);
    expect(component.type()).toBe('text');
    expect(component.min()).toBe(-Infinity);
    expect(component.max()).toBe(Infinity);
  });

  it('should display the label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('.input-label');
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should not display the label when not provided', () => {
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('.input-label');
    expect(labelElement).toBeFalsy();
  });

  it('should add border class when border is true', () => {
    fixture.componentRef.setInput('border', true);
    fixture.detectChanges();

    const inputWrapper = fixture.nativeElement.querySelector('.input-wrapper');
    expect(inputWrapper.classList.contains('input-border')).toBe(true);
  });

  it('should not add border class when border is false', () => {
    fixture.componentRef.setInput('border', false);
    fixture.detectChanges();

    const inputWrapper = fixture.nativeElement.querySelector('.input-wrapper');
    expect(inputWrapper.classList.contains('input-border')).toBe(false);
  });

  it('should add error class when errorState is true', () => {
    fixture.componentRef.setInput('errorState', true);
    fixture.detectChanges();

    const inputWrapper = fixture.nativeElement.querySelector('.input-wrapper');
    expect(inputWrapper.classList.contains('error')).toBe(true);
  });

  it('should set input type based on type input', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.type).toBe('password');
  });

  it('should set min and max attributes when provided', () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.min).toBe('10');
    expect(inputElement.max).toBe('100');
  });

  it('should display icon when iconUrl is provided', () => {
    fixture.componentRef.setInput('iconUrl', 'test-icon.png');
    fixture.detectChanges();

    const iconElement = fixture.nativeElement.querySelector('.input-icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement.getAttribute('src')).toBe('test-icon.png');
  });

  it('should not display icon when iconUrl is not provided', () => {
    fixture.componentRef.setInput('iconUrl', '');
    fixture.detectChanges();

    const iconElement = fixture.nativeElement.querySelector('.input-icon');
    expect(iconElement).toBeFalsy();
  });

  it('should emit iconClicked event when icon is clicked', () => {
    const iconClickSpy = jest.spyOn(component.iconClicked, 'emit');

    fixture.componentRef.setInput('iconUrl', 'test-icon.png');
    fixture.detectChanges();

    const iconElement = fixture.nativeElement.querySelector('.input-icon');
    iconElement.click();

    expect(iconClickSpy).toHaveBeenCalled();
  });

  describe('ControlValueAccessor implementation', () => {
    it('should call onChange with new value on input change', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = 'new value';
      inputElement.dispatchEvent(new Event('input'));

      expect(onChangeSpy).toHaveBeenCalledWith('new value');
      expect(component.value).toBe('new value');
    });

    it('should call onTouched on blur', () => {
      const onTouchedSpy = jest.fn();
      component.registerOnTouched(onTouchedSpy);

      const blurSpy = jest.spyOn(component.blur, 'emit');
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.dispatchEvent(new Event('blur'));

      expect(onTouchedSpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
    });

    it('should update value when writeValue is called', () => {
      component.writeValue('test value');
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(component.value).toBe('test value');
      expect(inputElement.value).toBe('test value');
    });

    it('should handle empty value in writeValue', () => {
      component.writeValue('');
      expect(component.value).toBe('');

      component.writeValue(null as any);
      expect(component.value).toBe('');
    });

    it('should set disabled state when setDisabledState is called', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(component.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);
    });
  });

  describe('Event handlers', () => {
    it('should handle input change event with null value', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: { value: null } });

      component.onInputChange(event);
      expect(component.value).toBe('');
      expect(onChangeSpy).toHaveBeenCalledWith('');
    });

    it('should not emit icon click when disabled', () => {
      const iconClickSpy = jest.spyOn(component.iconClicked, 'emit');
      component.setDisabledState(true);
      fixture.detectChanges();

      fixture.componentRef.setInput('iconUrl', 'test-icon.png');
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.input-icon');
      iconElement.click();

      expect(iconClickSpy).not.toHaveBeenCalled();
    });
  });
});
