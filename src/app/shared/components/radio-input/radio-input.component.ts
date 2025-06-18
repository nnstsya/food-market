import { Component, forwardRef, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrl: './radio-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioInputComponent),
      multi: true
    }
  ],
  standalone: false
})
export class RadioInputComponent implements ControlValueAccessor {
  label: InputSignal<string> = input<string>('');
  value: InputSignal<string> = input.required<string>();
  additionalText: InputSignal<string> = input<string>('');
  iconUrl: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);

  checked: boolean = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  change: OutputEmitterRef<string> = output<string>();

  writeValue(value: string): void {
    this.checked = this.value() === value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onRadioChange(): void {
    if (!this.disabled()) {
      this.checked = true;
      this.onChange(this.value());
      this.onTouched();
      this.change.emit(this.value());
    }
  }
}
