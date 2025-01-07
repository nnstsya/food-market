import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  secondary: InputSignal<boolean> = input<boolean>(false);
  outlined: InputSignal<boolean> = input<boolean>(false);
}
