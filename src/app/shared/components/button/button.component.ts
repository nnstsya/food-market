import { Component, input, InputSignal } from '@angular/core';
import { ButtonType } from "@shared/components/button/button.model";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  variant: InputSignal<ButtonType> = input<ButtonType>('basic');
  size: InputSignal<'s' | 'lg'> = input<'s' | 'lg'>('lg');
  disabled: InputSignal<boolean> = input<boolean>(false);
}
