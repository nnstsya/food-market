import { Component, forwardRef, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface Option {
  id: number;
  title: string;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  options: InputSignal<Option[]> = input.required<Option[]>();
  label: InputSignal<string> = input<string>('');
  placeholder: InputSignal<string> = input<string>('Select an option');
  optionSelected: OutputEmitterRef<Option> = output<Option>();
  background: InputSignal<boolean> = input<boolean>(false);

  selectedOption: string | null = null;
  isDropdownOpen: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.onTouched();
  }

  selectOption(option: Option) {
    this.selectedOption = option.title;
    this.isDropdownOpen = false;
    this.optionSelected.emit(option);
    this.onChange(option.title);
  }

  writeValue(value: string): void {
    this.selectedOption = value || null;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
