import {
  Component,
  forwardRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent {
  label: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);

  changed: OutputEmitterRef<boolean> = output<boolean>();

  isChecked: boolean = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.isChecked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleCheck(): void {
    if (!this.disabled()) {
      this.isChecked = !this.isChecked;
      this.onChange(this.isChecked);
      this.onTouched();
      this.changed.emit(this.isChecked);
    }
  }
}
