import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRecoveryComponent } from './password-recovery.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '@shared/components/modal/modal.service';
import { AuthService } from '@auth/services/auth.service';
import { of, throwError } from 'rxjs';
import { SharedModule } from "@shared/shared.module";
import { passwordRecoveryDataMock } from "@core/mocks/auth";

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent;
  let fixture: ComponentFixture<PasswordRecoveryComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let modalServiceMock: jest.Mocked<ModalService>;

  beforeEach(async () => {
    authServiceMock = {
      resetPassword: jest.fn()
    } as any;

    modalServiceMock = {
      hideModal: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasswordRecoveryComponent],
      imports: [ReactiveFormsModule, SharedModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: ModalService, useValue: modalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.newPasswordVisible).toEqual(false);
    component.toggleNewPasswordVisibility();
    expect(component.newPasswordVisible).toEqual(true);
  });

  it('should toggle repeated password visibility', () => {
    expect(component.repeatedPasswordVisible).toEqual(false);
    component.toggleRepeatedPasswordVisibility();
    expect(component.repeatedPasswordVisible).toEqual(true);
  });

  it('should validate form fields', () => {
    const form = component.passwordRecoveryForm;
    expect(form.valid).toEqual(false);

    form.patchValue(passwordRecoveryDataMock);

    expect(form.valid).toEqual(true);
  });

  it('should show error for mismatched passwords', () => {
    const form = component.passwordRecoveryForm;

    form.patchValue({
      email: 'test@example.com',
      newPassword: 'Password123!',
      repeatedPassword: 'DifferentPassword123!'
    });

    expect(form.errors?.['passwordsMismatch']).toEqual(true);
  });

  it('should handle successful password reset', () => {
    authServiceMock.resetPassword.mockReturnValue(of(true));

    component.passwordRecoveryForm.patchValue(passwordRecoveryDataMock);

    component.onSubmit();

    expect(authServiceMock.resetPassword).toHaveBeenCalled();
    expect(modalServiceMock.hideModal).toHaveBeenCalled();
    expect(component.serverError).toBe('');
  });

  it('should handle password reset error', () => {
    const errorMessage = 'Reset failed';
    authServiceMock.resetPassword.mockReturnValue(throwError(() => new Error(errorMessage)));

    component.passwordRecoveryForm.patchValue(passwordRecoveryDataMock);

    component.onSubmit();

    expect(component.serverError).toBe(errorMessage);
    expect(modalServiceMock.hideModal).not.toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    component.passwordRecoveryForm.patchValue({
      email: 'invalid-email',
      newPassword: 'short',
      repeatedPassword: 'short'
    });

    component.onSubmit();

    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should not submit when passwords do not match', () => {
    component.passwordRecoveryForm.patchValue({
      email: 'test@example.com',
      newPassword: 'Password123!',
      repeatedPassword: 'DifferentPassword123!'
    });

    component.onSubmit();

    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
  });
});
