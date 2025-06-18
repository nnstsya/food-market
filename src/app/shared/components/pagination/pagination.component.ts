import { Component, input, InputSignal, OnInit, output, OutputEmitterRef, effect } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: false
})
export class PaginationComponent implements OnInit {
  itemName: InputSignal<string> = input<string>('');
  totalItems: InputSignal<number> = input.required<number>();
  itemsPerPage: InputSignal<number> = input.required<number>();
  resetPages: InputSignal<boolean> = input<boolean>(false);
  pageChanged: OutputEmitterRef<number[]> = output();

  currentPages: number[] = JSON.parse(localStorage.getItem('currentPages') || '[1]');

  constructor() {
    effect(() => {
      if (this.resetPages()) {
        this.currentPages = [1];
        localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
        this.pageChanged.emit(this.currentPages);
      }
    });
  }

  ngOnInit(): void {
    this.pageChanged.emit(this.currentPages);
  }

  get itemWithCapital(): string {
    return this.itemName().replace(/^./, (char) => char.toUpperCase());
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  get pagesCountArray(): number[] {
    const pagesCount: number[] = [];

    for (let i: number = 1; i <= this.totalPages; i++) {
      pagesCount.push(i);
    }

    return pagesCount;
  }

  onPageClick(page: number): void {
    this.currentPages = [page];
    localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
    this.pageChanged.emit(this.currentPages);
  }

  onShowMore(): void {
    const lastSelectedPage: number = this.currentPages[this.currentPages.length - 1];
    if (lastSelectedPage < this.totalPages) {
      this.currentPages.push(lastSelectedPage + 1);
      localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
      this.pageChanged.emit(this.currentPages);
    }
  }
}
