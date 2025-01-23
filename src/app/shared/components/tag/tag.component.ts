import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  text: InputSignal<string | number> = input.required<string | number>();
}
