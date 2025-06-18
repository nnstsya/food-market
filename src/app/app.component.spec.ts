import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { BehaviorSubject, of } from 'rxjs';
import { LayoutModule } from "@layout/layout.module";
import { SharedModule } from "@shared/shared.module";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { AuthModule } from "@auth/auth.module";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockModalService: jest.Mocked<ModalService>;

  beforeEach(async () => {
    mockModalService = {
      modalVisible$: new BehaviorSubject<boolean>(false),
      modalType$: new BehaviorSubject<string>(''),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [LayoutModule, SharedModule, RouterOutlet, AuthModule],
      providers: [
        { provide: ModalService, useValue: mockModalService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, queryParams: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with modal closed', () => {
    component.modalOpened$.subscribe(isOpen => {
      expect(isOpen).toBeFalsy();
    });
  });

  it('should initialize with empty modal type', () => {
    component.modalType$.subscribe(type => {
      expect(type).toBe('');
    });
  });

  it('should update when modal visibility changes', () => {
    (mockModalService.modalVisible$ as BehaviorSubject<boolean>).next(true);

    component.modalOpened$.subscribe(isOpen => {
      expect(isOpen).toBeTruthy();
    });
  });

  it('should update when modal type changes', () => {
    const newModalType = 'login';
    (mockModalService.modalType$ as BehaviorSubject<string>).next(newModalType);

    component.modalType$.subscribe(type => {
      expect(type).toBe(newModalType);
    });
  });
});
