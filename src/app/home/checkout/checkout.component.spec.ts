import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "@shared/shared.module";

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutComponent
      ],
      imports: [ReactiveFormsModule, SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form fields', () => {
      expect(component.checkoutForm.get('firstName')?.value).toBe('');
      expect(component.checkoutForm.get('lastName')?.value).toBe('');
      expect(component.checkoutForm.get('email')?.value).toBe('');
      expect(component.checkoutForm.get('phoneNumber')?.value).toBe('');
      expect(component.checkoutForm.get('address')?.value).toBe('');
      expect(component.checkoutForm.get('city')?.value).toBe('');
      expect(component.checkoutForm.get('state')?.value).toBe('');
      expect(component.checkoutForm.get('zipCode')?.value).toBe('');
    });

    it('should have all fields as required', () => {
      const controls = component.checkoutForm.controls;
      Object.keys(controls).forEach(key => {
        const control = component.checkoutForm.get(key);
        control?.setValue('');
        expect(control?.errors?.['required']).toBeTruthy();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate firstName with only letters', () => {
      const control = component.checkoutForm.get('firstName');

      control?.setValue('John123');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('John');
      expect(control?.errors).toBeNull();
    });

    it('should validate email format', () => {
      const control = component.checkoutForm.get('email');

      control?.setValue('invalid-email');
      expect(control?.errors?.['email']).toBeTruthy();

      control?.setValue('valid@email.com');
      expect(control?.errors).toBeNull();
    });

    it('should validate phone number format', () => {
      const control = component.checkoutForm.get('phoneNumber');

      control?.setValue('123');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('1234567890');
      expect(control?.errors).toBeNull();
    });

    it('should validate ZIP code format', () => {
      const control = component.checkoutForm.get('zipCode');

      control?.setValue('too-long-zip-code');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('12345');
      expect(control?.errors).toBeNull();
    });
  });

  describe('Form Prefill', () => {
    it('should prefill form with user data from localStorage', () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890'
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      component.prefillFormData();

      expect(component.checkoutForm.get('firstName')?.value).toBe(mockUser.firstName);
      expect(component.checkoutForm.get('lastName')?.value).toBe(mockUser.lastName);
      expect(component.checkoutForm.get('email')?.value).toBe(mockUser.email);
      expect(component.checkoutForm.get('phoneNumber')?.value).toBe(mockUser.phoneNumber);

      localStorage.removeItem('user');
    });

    it('should handle empty localStorage', () => {
      localStorage.clear();
      component.prefillFormData();

      expect(component.checkoutForm.get('firstName')?.value).toBe('');
      expect(component.checkoutForm.get('lastName')?.value).toBe('');
      expect(component.checkoutForm.get('email')?.value).toBe('');
      expect(component.checkoutForm.get('phoneNumber')?.value).toBe('');
    });
  });

  describe('Country Options', () => {
    it('should initialize with country options', () => {
      expect(component.countryOptions).toBeDefined();
      expect(Array.isArray(component.countryOptions)).toBeTruthy();
      expect(component.countryOptions.length).toBeGreaterThan(0);
    });
  });
});
