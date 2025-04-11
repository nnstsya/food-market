import {
  Component,
  forwardRef,
  input,
  InputSignal, OnChanges, OnInit,
  output,
  OutputEmitterRef, SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  standalone: false
})
export class CheckboxComponent implements ControlValueAccessor, OnInit, OnChanges {
  label: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);
  checked: InputSignal<boolean> = input<boolean>(false);

  changed: OutputEmitterRef<boolean> = output<boolean>();

  isChecked: boolean = this.checked();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
   this.isChecked = this.checked();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checked']) {
      this.isChecked = this.checked();
    }
  }

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
