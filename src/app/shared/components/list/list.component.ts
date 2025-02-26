import { Component, input, InputSignal } from '@angular/core';

interface Item {
  id: number;
  title: string;
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
}
