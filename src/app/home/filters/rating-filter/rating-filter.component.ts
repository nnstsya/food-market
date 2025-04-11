import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { RatingCheckbox } from '@home/models/filter.model';

@Component({
  selector: 'app-rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrl: './rating-filter.component.scss',
  standalone: false
})
export class RatingFilterComponent {
  ratings: InputSignal<RatingCheckbox[]> = input.required<RatingCheckbox[]>();
  filterChanged: OutputEmitterRef<string> = output<string>();
  resetTrigger: InputSignal<boolean> = input(false);

  onFilterChange(ratingId: string): void {
    this.filterChanged.emit(ratingId);
  }
}
