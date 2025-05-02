import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { SharedModule } from "@shared/shared.module";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('heading', 'Test List');
    fixture.componentRef.setInput('items', [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ]);
    fixture.componentRef.setInput('buttonText', 'Click Me');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
