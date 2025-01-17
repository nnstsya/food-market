import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  variant: InputSignal<'basic' | 'secondary' | 'outlined'> = input<
    'basic' | 'secondary' | 'outlined'
  >('basic');
}
