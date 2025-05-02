import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { NgOptimizedImage } from '@angular/common';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [NgOptimizedImage]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for variant, size, and disabled', () => {
    expect(component.variant()).toBe('basic');
    expect(component.size()).toBe('lg');
    expect(component.disabled()).toBe(false);
  });

  it('should apply the correct ngClass for variant and size', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.componentRef.setInput('size', 's');
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('primary')).toBeTruthy();
    expect(buttonElement.classList.contains('s')).toBeTruthy();
  });

  it('should disable the button when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBe(true);
  });
});
