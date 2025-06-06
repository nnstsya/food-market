import { Injectable, signal, WritableSignal } from '@angular/core';
import { Blog } from '@core/models/blog.model';

export interface BlogFilterState {
  dates: {
    id: number;
    title: string;
    selected: boolean;
  }[];
  categories: {
    id: number;
    title: string;
    selected: boolean;
  }[];
  filterHistory: { type: 'date' | 'category'; id: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogFilterService {
  private readonly STORAGE_KEY = 'blogFilterState';
  private state: WritableSignal<BlogFilterState> = signal<BlogFilterState>(
    this.loadState() || {
      dates: [],
      categories: [],
      filterHistory: []
    }
  );

  initializeFilters(blogs: Blog[]): void {
    const savedState: BlogFilterState | null = this.loadState();
    const months: string[] = this.getLast5Months();
    const categories: string[] = this.extractCategories(blogs);

    const newState = {
      dates: months.map((month, index) => ({
        id: index,
        title: month,
        selected: savedState?.dates.find(d => d.title === month)?.selected || false
      })),
      categories: categories.map((category, index) => ({
        id: index,
        title: category,
        selected: savedState?.categories.find(c => c.title === category)?.selected || false
      })),
      filterHistory: savedState?.filterHistory || []
    };

    this.state.set(newState);
  }

  toggleFilter(type: 'date' | 'category', id: number): void {
    this.state.update(state => {
      const target = type === 'date' ? state.dates : state.categories;
      const currentItem = target.find(item => item.id === id);

      if (!currentItem) return state;

      state.filterHistory = state.filterHistory.filter(filter => filter.type !== type);

      target.forEach(item => item.selected = false);

      if (currentItem.selected) {
        currentItem.selected = false;
      } else {
        currentItem.selected = true;
        state.filterHistory.push({ type, id });
      }

      this.saveState(state);
      return { ...state };
    });
  }

  goBack(): void {
    this.state.update(state => {
      state.filterHistory.pop();

      state.dates.forEach(date => date.selected = false);
      state.categories.forEach(category => category.selected = false);

      state.filterHistory.forEach(filter => {
        const target = filter.type === 'date' ? state.dates : state.categories;
        const item = target.find(item => item.id === filter.id);
        if (item) {
          item.selected = true;
        }
      });

      this.saveState(state);
      return { ...state };
    });
  }

  getState(): WritableSignal<BlogFilterState> {
    return this.state;
  }

  filterBlogs(blogs: Blog[]): Blog[] {
    const state = this.state();
    const selectedDate = state.dates.find(d => d.selected);
    const selectedCategory = state.categories.find(c => c.selected);

    return blogs.filter(blog => {
      const matchesDate = !selectedDate || this.blogMatchesDate(blog, selectedDate.title);
      const matchesCategory = !selectedCategory || blog.category === selectedCategory.title;
      return matchesDate && matchesCategory;
    });
  }

  getCurrentFilterDescription(): string {
    const state = this.state();
    const selectedDate = state.dates.find(d => d.selected);
    const selectedCategory = state.categories.find(c => c.selected);

    if (selectedDate && selectedCategory) {
      return `${selectedDate.title}, ${selectedCategory.title}`;
    } else if (selectedDate) {
      return selectedDate.title;
    } else if (selectedCategory) {
      return selectedCategory.title;
    }
    return '';
  }

  private saveState(state: BlogFilterState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private loadState(): BlogFilterState | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  private getLast5Months(): string[] {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toLocaleString('en-US', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()));
    }

    return months;
  }

  private extractCategories(blogs: Blog[]): string[] {
    return [...new Set(blogs.map(blog => blog.category))];
  }

  private blogMatchesDate(blog: Blog, monthYear: string): boolean {
    const blogDate = new Date(blog.date.split('.').reverse().join('-'));
    const filterDate = new Date(monthYear);

    return blogDate.getMonth() === filterDate.getMonth() && blogDate.getFullYear() === filterDate.getFullYear();
  }
}
