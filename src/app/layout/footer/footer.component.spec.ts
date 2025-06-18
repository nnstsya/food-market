import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterLink, ActivatedRoute } from "@angular/router";

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue('mockToken'),
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterLink],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the FooterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should check authentication status from localStorage', () => {
    expect(component.isAuthenticated).toBe(true);
  });
});
