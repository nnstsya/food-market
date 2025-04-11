import { Component, ContentChildren, input, InputSignal, QueryList, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: false
})
export class TabsComponent {
  @ContentChildren(TemplateRef) tabContents!: QueryList<TemplateRef<any>>;

  tabTitles: InputSignal<string[]> = input.required<string[]>();
  tabTags: InputSignal<(number | null)[]> = input<(number | null)[]>([]);

  activeTab: number = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }
}
