import { Component, input, InputSignal } from '@angular/core';

interface Item {
  id: number;
  title: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false
})
export class ListComponent {
  heading: InputSignal<string> = input.required<string>();
  items: InputSignal<Item[]> = input.required<Item[]>();
  buttonText: InputSignal<string> = input<string>('');
  getLink: InputSignal<(title: string) => string> = input<(title: string) => string>(() => '');
}
