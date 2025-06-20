import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LayoutComponent } from "./layout.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LayoutModule } from "./layout.module";
import { HttpClientModule } from "@angular/common/http";

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [LayoutModule, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
