import { Component, forwardRef, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  placeholder: InputSignal<string | number> = input.required<string | number>();
  label: InputSignal<string> = input<string>('');
  iconUrl: InputSignal<string> = input<string>('');
  border: InputSignal<boolean> = input<boolean>(true);
  errorState: InputSignal<boolean> = input<boolean>(false);
  type: InputSignal<'password' | 'email' | 'text' | 'number'> = input<'password' | 'email' | 'text' | 'number'>('text');
  min: InputSignal<number> = input<number>(-Infinity);
  max: InputSignal<number> = input<number>(Infinity);
  multiline: InputSignal<boolean> = input<boolean>(false);

  blur: OutputEmitterRef<void> = output<void>();
  iconClicked: OutputEmitterRef<void> = output<void>();
  value: string = '';
  disabled: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.blur.emit();
    this.onTouched();
  }

  onIconClick(): void {
    this.iconClicked.emit();
  }
}
