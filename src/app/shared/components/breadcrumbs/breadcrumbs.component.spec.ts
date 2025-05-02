import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { Router, NavigationEnd, RouterLink, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Category } from '@core/models/category.model';
import { categoriesData } from "@core/mocks/categories";

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let mockRouter: jest.Mocked<Router>;
  const eventsSubject = new BehaviorSubject<NavigationEnd>(
    new NavigationEnd(1, '/category/subcategory', '/category/subcategory')
  );
  let currentUrl = '/category/subcategory';
  const mockActivatedRoute = {
    snapshot: {
      paramMap: new Map()
    }
  };

  beforeEach(async () => {
    mockRouter = {
      get url() { return currentUrl; },
      set url(value) { currentUrl = value; },
      events: eventsSubject.asObservable(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [RouterLink],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update breadcrumbs on navigation', () => {
    currentUrl = '/fruits/apples';
    eventsSubject.next(new NavigationEnd(1, '/fruits/apples', '/fruits/apples'));

    expect(component.breadcrumbs).toHaveLength(2);
    expect(component.breadcrumbs[0].label).toBe('Fruits');
    expect(component.breadcrumbs[1].label).toBe('Apples');
  });

  it('should handle URL parameters correctly', () => {
    currentUrl = '/category?pageSize=1';
    eventsSubject.next(new NavigationEnd(1, '/category?pageSize=1', '/category?pageSize=1'));

    expect(component.breadcrumbs).toHaveLength(1);
    expect(component.breadcrumbs[0].url).toBe('/category?pageSize=1');
  });

  it('should format category labels correctly', () => {
    currentUrl = '/DRINKS';
    eventsSubject.next(new NavigationEnd(1, '/DRINKS', '/DRINKS'));

    expect(component.breadcrumbs[0].label).toBe(categoriesData[Category.DRINKS]);
  });
});
