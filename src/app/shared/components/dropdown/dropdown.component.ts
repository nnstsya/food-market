import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

export interface Option {
  id: number;
  title: string;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  options: InputSignal<Option[]> = input.required<Option[]>();
  placeholder: InputSignal<string> = input<string>('Select an option');
  optionSelected: OutputEmitterRef<Option> = output<Option>();

  selectedOption: string | null = null;
  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: Option) {
    this.selectedOption = option.title;
    this.isDropdownOpen = false;
    this.optionSelected.emit(option);
  }
}
