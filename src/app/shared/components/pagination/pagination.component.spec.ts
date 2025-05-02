import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { SharedModule } from '@shared/shared.module';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('itemName', 'products');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset pages when resetPages signal is true', () => {
    localStorage.setItem('currentPages', '[2]');

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('itemsPerPage', 10);

    fixture.componentRef.setInput('resetPages', true);

    fixture.detectChanges();

    expect(component.currentPages).toEqual([1]);
    expect(localStorage.getItem('currentPages')).toBe('[1]');
  });

  it('should initialize with correct values from localStorage', () => {
    localStorage.setItem('currentPages', '[1,2]');
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    expect(component.currentPages).toEqual([1,2]);
  });

  it('should calculate total pages correctly', () => {
    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('itemsPerPage', 10);
    expect(component.totalPages).toBe(10);
  });

  it('should generate correct pages count array', () => {
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('itemsPerPage', 10);
    expect(component.pagesCountArray).toEqual([1, 2, 3]);
  });

  it('should capitalize item name correctly', () => {
    fixture.componentRef.setInput('itemName', 'products');
    expect(component.itemWithCapital).toBe('Products');
  });

  it('should emit current pages on initialization', () => {
    localStorage.clear();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    const emitSpy = jest.spyOn(component.pageChanged, 'emit');
    component.ngOnInit();
    expect(emitSpy).toHaveBeenCalledWith([1]);
  });

  it('should handle page click correctly', () => {
    const emitSpy = jest.spyOn(component.pageChanged, 'emit');
    component.onPageClick(3);
    expect(component.currentPages).toEqual([3]);
    expect(emitSpy).toHaveBeenCalledWith([3]);
  });

  it('should handle show more correctly', () => {
    component.currentPages = [1];
    const emitSpy = jest.spyOn(component.pageChanged, 'emit');
    component.onShowMore();
    expect(component.currentPages).toEqual([1, 2]);
    expect(emitSpy).toHaveBeenCalledWith([1, 2]);
  });
});
