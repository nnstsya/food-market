import { TestBed } from '@angular/core/testing';
import { BlogFilterService } from './blog-filter.service';
import { Blog } from '@core/models/blog.model';

describe('BlogFilterService', () => {
  let service: BlogFilterService;
  let mockBlogs: Blog[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogFilterService]
    });
    service = TestBed.inject(BlogFilterService);
    localStorage.clear();

    mockBlogs = [
      { id: 1, date: '15.6.2020', category: 'Food', title: 'Test 1', author: 'Author 1', blogImage: '', authorAvatar: '' },
      { id: 2, date: '17.6.2020', category: 'Health', title: 'Test 2', author: 'Author 2', blogImage: '', authorAvatar: '' },
      { id: 3, date: '01.7.2020', category: 'Food', title: 'Test 3', author: 'Author 3', blogImage: '', authorAvatar: '' }
    ];
  });

  it('should initialize filters correctly', () => {
    service.initializeFilters(mockBlogs);
    const state = service.getState()();

    expect(state.dates.length).toBe(5);
    expect(state.categories.length).toBe(2);
    expect(state.filterHistory).toEqual([]);
  });

  it('should toggle date filter correctly', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('date', 0);

    const state = service.getState()();
    expect(state.dates[0].selected).toBe(true);
    expect(state.filterHistory).toEqual([{ type: 'date', id: 0 }]);
  });

  it('should toggle category filter correctly', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('category', 0);

    const state = service.getState()();
    expect(state.categories[0].selected).toBe(true);
    expect(state.filterHistory).toEqual([{ type: 'category', id: 0 }]);
  });

  it('should handle going back in filter history', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('date', 0);
    service.toggleFilter('category', 0);
    service.goBack();

    const state = service.getState()();
    expect(state.filterHistory.length).toBe(1);
  });

  it('should filter blogs correctly', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('category', 0);

    const filteredBlogs = service.filterBlogs(mockBlogs);
    expect(filteredBlogs.length).toBe(1);
  });

  it('should persist state in localStorage', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('date', 0);

    const savedState = JSON.parse(localStorage.getItem('blogFilterState') || '');
    expect(savedState.filterHistory.length).toBe(1);
  });

  it('should generate correct filter description', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('category', 0);

    const description = service.getCurrentFilterDescription();
    expect(description).toBe('Food');
  });

  it('should handle multiple active filters in description', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('date', 0);
    service.toggleFilter('category', 0);

    const description = service.getCurrentFilterDescription();
    expect(description).toContain(',');
  });

  it('should handle invalid filter id', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('date', 999);
    const state = service.getState()();
    expect(state.filterHistory).toEqual([]);
  });

  it('should handle null saved state', () => {
    localStorage.removeItem('blogFilterState');
    service.initializeFilters(mockBlogs);
    const state = service.getState()();
    expect(state.filterHistory).toEqual([]);
  });

  it('should match blog date correctly', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('date', 0);
    const filteredBlogs = service.filterBlogs(mockBlogs);
    expect(filteredBlogs.length).toBe(2);
  });

  it('should handle empty filter history on back navigation', () => {
    service.initializeFilters(mockBlogs);
    service.goBack();
    const state = service.getState()();
    expect(state.filterHistory).toEqual([]);
  });

  it('should return empty description with no filters', () => {
    service.initializeFilters(mockBlogs);
    expect(service.getCurrentFilterDescription()).toBe('');
  });

  it('should initialize with saved state selections', () => {
    const savedState = {
      dates: [{ id: 0, title: 'June 2023', selected: true }],
      categories: [{ id: 0, title: 'Food', selected: true }],
      filterHistory: []
    };
    localStorage.setItem('blogFilterState', JSON.stringify(savedState));

    service.initializeFilters(mockBlogs);
    const state = service.getState()();

    expect(state.dates.find(d => d.title === 'June 2023')?.selected).toBe(true);
    expect(state.categories.find(c => c.title === 'Food')?.selected).toBe(true);
  });

  it('should initialize with default false selections when no saved state', () => {
    service.initializeFilters(mockBlogs);
    const state = service.getState()();

    expect(state.dates[0].selected).toBe(false);
    expect(state.categories[0].selected).toBe(false);
  });

  it('should deselect filter when toggling an active filter', () => {
    service.initializeFilters(mockBlogs);
    service.toggleFilter('category', 0);

    let state = service.getState()();
    expect(state.categories[0].selected).toBe(true);

    service.toggleFilter('category', 0);
    state = service.getState()();
    expect(state.categories[0].selected).toBe(false);
  });

  it('should return only date filter description when only date is selected', () => {
    service.initializeFilters(mockBlogs);
    const dateId = service.getState()().dates[0].id;
    service.toggleFilter('date', dateId);

    const description = service.getCurrentFilterDescription();
    expect(description).toBe(service.getState()().dates[0].title);
  });
});
