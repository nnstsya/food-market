import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  text: InputSignal<string | number> = input.required<string | number>();
  removable: InputSignal<boolean> = input<boolean>(false);
  tagRemoved: OutputEmitterRef<void> = output<void>();
  color: InputSignal<'green' | 'gray'> = input<'green' | 'gray'>('green');

  visible: boolean = true;

  remove(): void {
    this.tagRemoved.emit();

    this.visible = false;
  }
}
