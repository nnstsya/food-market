import {
  Component,
  input,
  InputSignal,
  OnChanges,
  output,
  OutputEmitterRef,
  SimpleChanges
} from '@angular/core';

interface Range {
  min: number;
  max: number;
}

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrl: './range.component.scss'
})
export class RangeComponent implements OnChanges {
  min: InputSignal<number> = input.required<number>();
  max: InputSignal<number> = input.required<number>();
  step: InputSignal<number> = input<number>(1);

  rangeChange: OutputEmitterRef<Range> = output<Range>();

  minValue: number = 0;
  maxValue: number = 0;
  minInputValue: number = 0;
  maxInputValue: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['max']) {
      this.resetRange();
    }
  }

  get trackLeft(): number {
    return ((this.minValue - this.min()) / (this.max() - this.min())) * 100;
  }

  get trackWidth(): number {
    return ((this.maxValue - this.minValue) / (this.max() - this.min())) * 100;
  }

  get maxSliderWidth(): number {
    return this.max() - this.min() === this.step() || this.max() === this.minValue + this.step()
      ? 7.2
      : ((this.max() - this.minValue) / (this.max() - this.min())) * 100 - (this.step() / (this.max() - this.min()) * 100) * 0.95;
  }

  get minSliderWidth(): number {
    return ((this.maxValue - this.min()) / (this.max() - this.min())) * 100 - (this.step() / (this.max() - this.min()) * 100) * 0.95;
  }

  handleInputChange(inputType: 'min' | 'max'): void {
    if (inputType === 'min') {
      this.minValue = +this.minInputValue;
    } else if (inputType === 'max') {
      this.maxValue = +this.maxInputValue;
    }

    this.validateRange(inputType);
  }

  handleSliderInput(event: Event, type: 'min' | 'max'): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const value = Number(inputValue);

    if (isNaN(value)) {
      return;
    }

    if (type === 'min') {
      this.minValue = value;
    } else {
      this.maxValue = value;
    }

    this.validateRange(type);
  }

  validateRange(inputType: 'min' | 'max'): void {
    if (inputType === 'min') {
      if (this.minValue >= this.maxValue) {
        this.minValue = this.maxValue - this.step();
      }

      if (this.minValue < this.min()) {
        this.minValue = this.min();
      }

      this.minValue = Math.floor(this.minValue);
      this.minInputValue = this.minValue;
    } else if (inputType === 'max') {
      if (this.maxValue <= this.minValue) {
        this.maxValue = this.minValue + this.step();
      }

      if (this.maxValue > this.max()) {
        this.maxValue = this.max();
      }

      this.maxValue = Math.ceil(this.maxValue);
      this.maxInputValue = this.maxValue;
    }

    this.rangeChange.emit({ min: this.minValue, max: this.maxValue });
  }

  resetRange(): void {
    this.minValue = this.min();
    this.maxValue = this.max();
    this.minInputValue = this.min();
    this.maxInputValue = this.max();

    this.rangeChange.emit({ min: this.min(), max: this.max() });
  }
}
