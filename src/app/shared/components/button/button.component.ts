import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  variant: InputSignal<'secondary' | 'outlined' | 'basic'> = input<'secondary' | 'outlined' | 'basic'>('basic');
  size: InputSignal<'s' | 'lg'> = input<'s' | 'lg'>('lg');
}
