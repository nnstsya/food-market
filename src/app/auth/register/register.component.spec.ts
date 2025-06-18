import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '@shared/components/modal/modal.service';
import { AuthService } from '@auth/services/auth.service';
import { of, throwError } from 'rxjs';
import { SharedModule } from "@shared/shared.module";
import { userDataMock } from "@core/mocks/auth";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockModalService: jest.Mocked<ModalService>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockModalService = {
      hideModal: jest.fn(),
      showModal: jest.fn()
    } as any;

    mockAuthService = {
      signUp: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, SharedModule],
      providers: [
        FormBuilder,
        { provide: ModalService, useValue: mockModalService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalsy();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTruthy();
  });

  it('should toggle repeated password visibility', () => {
    expect(component.repeatedPasswordVisible).toBeFalsy();
    component.toggleRepeatedPasswordVisibility();
    expect(component.repeatedPasswordVisible).toBeTruthy();
  });

  it('should open login modal', () => {
    component.openLogInModal();
    expect(mockModalService.showModal).toHaveBeenCalledWith('login');
  });

  it('should handle form submission with valid data', () => {
    mockAuthService.signUp.mockReturnValue(of(userDataMock));

    component.signUpForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      phoneNumber: '1234567890123',
      email: 'john@doe.com',
      password: 'Password123!',
      repeatedPassword: 'Password123!',
      newsletterConsent: false
    });

    component.onSubmit();

    expect(mockAuthService.signUp).toHaveBeenCalled();
    expect(mockModalService.hideModal).toHaveBeenCalled();
    expect(component.serverError).toBe('');
  });

  it('should handle password mismatch', () => {
    component.signUpForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      phoneNumber: '1234567890123',
      email: 'john@doe.com',
      password: 'Password123!',
      repeatedPassword: 'DifferentPassword123!',
      newsletterConsent: false
    });

    component.onSubmit();

    expect(mockAuthService.signUp).not.toHaveBeenCalled();
    expect(component.serverError).toBe('Passwords must be identical. Please ensure both fields match.');
  });

  it('should handle server error', () => {
    const errorMessage = 'Server error';
    mockAuthService.signUp.mockReturnValue(throwError(() => new Error(errorMessage)));

    component.signUpForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      phoneNumber: '1234567890123',
      email: 'john@doe.com',
      password: 'Password123!',
      repeatedPassword: 'Password123!',
      newsletterConsent: false
    });

    component.onSubmit();
    expect(component.serverError).toBe(errorMessage);
  });

  it('should not submit invalid form', () => {
    component.signUpForm.patchValue({
      firstName: '123',
      lastName: 'Doe',
      username: 'johndoe',
      phoneNumber: '123',
      email: 'invalid-email',
      password: 'short',
      repeatedPassword: 'short',
      newsletterConsent: false
    });

    component.onSubmit();

    expect(mockAuthService.signUp).not.toHaveBeenCalled();
  });

  it('should not submit empty form', () => {
    component.onSubmit();
    expect(mockAuthService.signUp).not.toHaveBeenCalled();
  });
});

