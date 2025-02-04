import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  label: InputSignal<string> = input.required<string>();
  itemsCount: InputSignal<number> = input.required<number>();
  checked: InputSignal<boolean> = input<boolean>(false);
  filterChanged: OutputEmitterRef<boolean> = output<boolean>();

  onFilterChange(checked: boolean): void {
    this.filterChanged.emit(checked);
  }
}
