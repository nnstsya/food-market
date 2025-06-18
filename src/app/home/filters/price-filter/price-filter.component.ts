import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal, ViewChild } from '@angular/core';
import { RangeComponent } from "@shared/components/range/range.component";

type Range = { min: number; max: number };

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  standalone: false
})
export class PriceFilterComponent {
  @ViewChild(RangeComponent) range!: RangeComponent;

  priceRange: InputSignal<Range> = input.required<Range>();
  filterChanged: OutputEmitterRef<Range> = output<Range>();
  resetTrigger: InputSignal<boolean> = input(false);

  minValue: Signal<number> = computed(() => this.priceRange().min);
  maxValue: Signal<number> = computed(() => this.priceRange().max);

  onPriceChange(range: Range): void {
    this.filterChanged.emit(range);
  }

  reset(): void {
    this.range.resetRange();
  }
}
