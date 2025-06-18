import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioInputComponent } from './radio-input.component';
import { FormsModule } from '@angular/forms';

describe('RadioInputComponent', () => {
  let component: RadioInputComponent;
  let fixture: ComponentFixture<RadioInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RadioInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioInputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input signals', () => {
    it('should set label', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      expect(component.label()).toBe('Test Label');
    });

    it('should set value', () => {
      expect(component.value()).toBe('test-value');
    });

    it('should set additionalText', () => {
      fixture.componentRef.setInput('additionalText', 'Additional Info');
      expect(component.additionalText()).toBe('Additional Info');
    });

    it('should set iconUrl', () => {
      fixture.componentRef.setInput('iconUrl', 'test-icon.png');
      expect(component.iconUrl()).toBe('test-icon.png');
    });

    it('should set disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      expect(component.disabled()).toBeTruthy();
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should update checked state when writeValue is called', () => {
      component.writeValue('test-value');
      expect(component.checked).toBeTruthy();

      component.writeValue('different-value');
      expect(component.checked).toBeFalsy();
    });

    it('should call onChange and onTouched when radio is changed', () => {
      const onChangeSpy = jest.fn();
      const onTouchedSpy = jest.fn();
      component.registerOnChange(onChangeSpy);
      component.registerOnTouched(onTouchedSpy);

      component.onRadioChange();

      expect(onChangeSpy).toHaveBeenCalledWith('test-value');
      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should not trigger changes when disabled', () => {
      const onChangeSpy = jest.fn();
      const onTouchedSpy = jest.fn();
      const emitSpy = jest.spyOn(component.change, 'emit');
      
      component.registerOnChange(onChangeSpy);
      component.registerOnTouched(onTouchedSpy);
      fixture.componentRef.setInput('disabled', true);

      component.onRadioChange();

      expect(onChangeSpy).not.toHaveBeenCalled();
      expect(onTouchedSpy).not.toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Change events', () => {
    it('should emit change event when radio is selected', () => {
      const emitSpy = jest.spyOn(component.change, 'emit');
      
      component.onRadioChange();

      expect(emitSpy).toHaveBeenCalledWith('test-value');
    });

    it('should update checked state when radio is selected', () => {
      expect(component.checked).toBeFalsy();
      
      component.onRadioChange();
      
      expect(component.checked).toBeTruthy();
    });
  });
});
