import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { SharedModule } from "@shared/shared.module";

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [FilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Test Filter');
    fixture.componentRef.setInput('itemsCount', 10);
    fixture.componentRef.setInput('checked', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChanged on change', () => {
    const spy = jest.spyOn(component.filterChanged, 'emit');

    component.onFilterChange(true);

    expect(spy).toHaveBeenCalledWith(true);
  });
});
