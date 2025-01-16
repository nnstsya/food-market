import {
  Directive,
  OnChanges,
  Renderer2,
  ElementRef,
  SimpleChanges,
  inject,
  InputSignal,
  input
} from '@angular/core';

@Directive({
  selector: '[appSkeleton]',
})
export class SkeletonDirective implements OnChanges {
  loading: InputSignal<boolean> = input.required<boolean>({ alias: 'appSkeleton' });

  private skeletonElement: HTMLElement | null = null;
  private el: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges): void {
    if ('loading' in changes) {
      this.toggleSkeleton(this.loading());
    }
  }

  private toggleSkeleton(loading: boolean): void {
    const hostElement: HTMLElement = this.el.nativeElement;

    if (loading) {
      if (!this.skeletonElement) {
        this.skeletonElement = this.renderer.createElement('div');
        this.renderer.addClass(this.skeletonElement, 'skeleton-loader');

        const rect: DOMRect = hostElement.getBoundingClientRect();
        const scrollTop: number = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft: number = window.scrollX || document.documentElement.scrollLeft;

        const width: number = rect.width;
        const height: number = rect.height;
        const top: number = rect.top + scrollTop;
        const left: number = rect.left + scrollLeft;

        this.renderer.setStyle(this.skeletonElement, 'width', `${width}px`);
        this.renderer.setStyle(this.skeletonElement, 'height', `${height}px`);
        this.renderer.setStyle(this.skeletonElement, 'top', `${top}px`);
        this.renderer.setStyle(this.skeletonElement, 'left', `${left}px`);
        this.renderer.setStyle(this.skeletonElement, 'border-radius', '4px');
        this.renderer.setStyle(this.skeletonElement, 'position', 'absolute');
        this.renderer.setStyle(this.skeletonElement, 'z-index', '10');

        this.renderer.insertBefore(hostElement.parentNode, this.skeletonElement, hostElement);
      }

      this.renderer.setStyle(hostElement, 'visibility', 'hidden');
    } else {
      if (this.skeletonElement) {
        this.renderer.removeChild(hostElement.parentNode, this.skeletonElement);
        this.skeletonElement = null;
      }

      this.renderer.setStyle(hostElement, 'visibility', 'visible');
    }
  }
}
