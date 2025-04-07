import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from "@shared/components/dropdown/dropdown.component";
import { countryOptions } from "@core/mocks/countries";
import { User } from "@auth/models/user.model";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  countryOptions: Option[] = countryOptions;

  shippingMethods = [
    { value: 'fedex', label: 'FedEx', additionalText: 'Additional price', iconUrl: 'assets/icons/ic-fedex.svg' },
    { value: 'dhl', label: 'DHL', additionalText: 'Additional price', iconUrl: 'assets/icons/ic-dhl.svg' }
  ];

  paymentMethods = [
    { value: 'credit', label: 'Credit card', iconUrl: 'assets/icons/ic-visa-mastercard.svg', enabled: true },
    { value: 'paypal', label: 'PayPal', iconUrl: 'assets/icons/ic-paypal.svg', enabled: false },
    { value: 'bitcoin', label: 'Bitcoin', iconUrl: 'assets/icons/ic-bitcoin.svg', enabled: false }
  ];

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+?[0-9]{10,14}$/)
      ]],
      address: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\s,.-]+$/)
      ]],
      city: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]{1,250}$/)
      ]],
      state: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]{1,250}$/)
      ]],
      zipCode: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]{1,9}$/)
      ]],
      shippingMethod: ['fedex', Validators.required],
      paymentMethod: ['credit', Validators.required],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{16}$/)
      ]],
      cardHolder: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]{1,250}$/)
      ]],
      expirationDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{2})$/)
      ]],
      cvc: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{3}$/)
      ]],
      orderNotes: ['', [
      Validators.maxLength(500)
      ]],
      acceptTerms: [false, [
      Validators.requiredTrue
      ]],
      confirmOrder: [false]
    });
  }

  ngOnInit() {
    this.prefillFormData();
  }

  prefillFormData() {
    const storedUserData: User | null = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;

    if (storedUserData) {
      this.checkoutForm.get('firstName')?.setValue(storedUserData.firstName);
      this.checkoutForm.get('lastName')?.setValue(storedUserData.lastName);
      this.checkoutForm.get('email')?.setValue(storedUserData.email);
      this.checkoutForm.get('phoneNumber')?.setValue(storedUserData.phoneNumber);
    }
  }

  onShippingMethodChange(value: string): void {
    this.checkoutForm.get('shippingMethod')?.setValue(value);
  }

  onPaymentMethodChange(value: string): void {
    this.checkoutForm.get('paymentMethod')?.setValue(value);
  }

  isPaymentMethodEnabled(methodValue: string): boolean {
    const method = this.paymentMethods.find(m => m.value === methodValue);
    return method ? method.enabled : false;
  }
}
