import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  standalone: false
})
export class BannerComponent {
  imageUrl: InputSignal<string> = input<string>('');
  gradientPosition: InputSignal<'top' | 'bottom' | 'none'> = input<'top' | 'bottom' | 'none'>('none');

  get backgroundStyle(): string {
    if (this.imageUrl()) {
      return this.gradientPosition() === 'top'
        ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0)), url(${this.imageUrl()}) no-repeat`
        : this.gradientPosition() === 'bottom'
          ? `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url(${this.imageUrl()}) no-repeat`
          : `url(${this.imageUrl()}) no-repeat`
    } else {
      return this.gradientPosition() === 'top'
        ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0)), url('assets/background-placeholder.svg') no-repeat`
        : this.gradientPosition() === 'bottom'
          ? `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url('assets/background-placeholder.svg') no-repeat`
          : `url('assets/background-placeholder.svg') #F4F8EC no-repeat`
    }
  }

  get textColor(): string {
    return this.gradientPosition() === 'none'
      ? '#000'
      : '#fff';
  }
}
