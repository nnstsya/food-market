import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

interface Item {
  id: number;
  title: string;
  selected?: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  heading: InputSignal<string> = input.required<string>();
  items: InputSignal<Item[]> = input.required<Item[]>();
  buttonText: InputSignal<string> = input<string>('');
  itemSelected: OutputEmitterRef<number> = output<number>();

  onItemClick(id: number): void {
    this.itemSelected.emit(id);
  }
}
