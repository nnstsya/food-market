import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "@shared/shared.module";
import { ShoppingCartService } from "@home/services/shopping-cart.service";
import { OrderSummaryComponent } from "@home/checkout/order-summary/order-summary.component";
import { signal } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: jest.Mocked<ShoppingCartService>;

  beforeEach(async () => {
    cartService = {
      clear: jest.fn(),
      items: signal([]),
      total: signal(0)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent, OrderSummaryComponent],
      imports: [ReactiveFormsModule, SharedModule, NgOptimizedImage],
      providers: [
        { provide: ShoppingCartService, useValue: cartService }
      ]
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
      expect(component.checkoutForm.get('country')?.value).toBe('');
      expect(component.checkoutForm.get('zipCode')?.value).toBe('');
    });

    it('should have required fields marked as required', () => {
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'country', 'zipCode'];
      requiredFields.forEach(field => {
        const control = component.checkoutForm.get(field);
        control?.setValue('');
        control?.markAsTouched();
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

    it('should update country when changed', () => {
      component.onCountryChange('Ukraine');
      expect(component.checkoutForm.get('country')?.value).toBe('Ukraine');
    });
  });

  describe('Shipping Methods', () => {
    it('should initialize with FedEx as default shipping method', () => {
      expect(component.checkoutForm.get('shippingMethod')?.value).toBe('fedex');
    });

    it('should update shipping method when changed', () => {
      component.onShippingMethodChange('dhl');
      expect(component.checkoutForm.get('shippingMethod')?.value).toBe('dhl');
    });

    it('should have correct shipping methods defined', () => {
      expect(component.shippingMethods.length).toBe(2);
      expect(component.shippingMethods[0].value).toBe('fedex');
      expect(component.shippingMethods[1].value).toBe('dhl');
    });
  });

  describe('Payment Methods', () => {
    it('should initialize with credit card as default payment method', () => {
      expect(component.checkoutForm.get('paymentMethod')?.value).toBe('credit');
    });

    it('should update payment method when changed', () => {
      component.onPaymentMethodChange('paypal');
      expect(component.checkoutForm.get('paymentMethod')?.value).toBe('paypal');
    });

    it('should correctly check if payment method is enabled', () => {
      expect(component.isPaymentMethodEnabled('credit')).toBeTruthy();
      expect(component.isPaymentMethodEnabled('paypal')).toBeFalsy();
      expect(component.isPaymentMethodEnabled('bitcoin')).toBeFalsy();
    });

    it('should return false for non-existent payment method', () => {
      expect(component.isPaymentMethodEnabled('invalid-method')).toBeFalsy();
    });
  });

  describe('Credit Card Form Validation', () => {
    it('should validate card number format', () => {
      const control = component.checkoutForm.get('cardNumber');

      control?.setValue('123');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('1234567890123456');
      expect(control?.errors).toBeNull();

      control?.setValue('12345678901234567');
      expect(control?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate card holder name', () => {
      const control = component.checkoutForm.get('cardHolder');

      control?.setValue('John123');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('John Doe');
      expect(control?.errors).toBeNull();
    });

    it('should validate expiration date format', () => {
      const control = component.checkoutForm.get('expirationDate');

      control?.setValue('12/12/12');
      expect(control?.errors).toBeNull();

      control?.setValue('13/13/13');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('1212/12');
      expect(control?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate CVC', () => {
      const control = component.checkoutForm.get('cvc');

      control?.setValue('12');
      expect(control?.errors?.['pattern']).toBeTruthy();

      control?.setValue('123');
      expect(control?.errors).toBeNull();

      control?.setValue('1234');
      expect(control?.errors?.['pattern']).toBeTruthy();
    });
  });

  describe('Form State', () => {
    it('should be invalid when empty', () => {
      expect(component.checkoutForm.valid).toBeFalsy();
    });

    it('should be valid when all required fields are filled correctly', () => {
      component.checkoutForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'US',
        zipCode: '10001',
        shippingMethod: 'fedex',
        paymentMethod: 'credit',
        cardNumber: '1234567890123456',
        cardHolder: 'John Doe',
        expirationDate: '01/12/25',
        cvc: '123',
        acceptTerms: true,
        confirmOrder: true
      });

      expect(component.checkoutForm.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.checkoutForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'US',
        zipCode: '10001',
        shippingMethod: 'fedex',
        paymentMethod: 'credit',
        cardNumber: '1234567890123456',
        cardHolder: 'John Doe',
        expirationDate: '01/12/25',
        cvc: '123',
        acceptTerms: true,
        confirmOrder: true
      });
    });

    it('should generate order ID on form submission', () => {
      const now = 1234567890;
      jest.spyOn(Date, 'now').mockImplementation(() => now);

      component.submitForm();

      expect(component.orderId).toBe(now);
      expect(component.formSubmitted).toBeTruthy();
    });

    it('should clear shopping cart on successful submission', () => {
      component.submitForm();

      expect(cartService.clear).toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
      component.checkoutForm.get('acceptTerms')?.setValue(false);
      component.checkoutForm.markAsTouched();

      jest.spyOn(component.checkoutForm, 'valid', 'get').mockReturnValue(false);

      component.submitForm();

      expect(cartService.clear).not.toHaveBeenCalled();
      expect(component.formSubmitted).toBeFalsy();
    });
  });
});

