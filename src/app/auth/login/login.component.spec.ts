import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { of, throwError } from 'rxjs';
import { SharedModule } from "@shared/shared.module";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let modalService: jest.Mocked<ModalService>;

  beforeEach(async () => {
    const mockAuthServiceMock = {
      signIn: jest.fn(),
    };

    const modalServiceMock = {
      showModal: jest.fn(),
      hideModal: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, FormsModule, SharedModule],
      providers: [
        { provide: AuthService, useValue: mockAuthServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBe(false);
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBe(true);
  });

  it('should open password recovery modal', () => {
    component.openPasswordRecoveryModal();
    expect(modalService.showModal).toHaveBeenCalledWith('passwordRecovery');
  });

  it('should open sign up modal', () => {
    component.openSignUpModal();
    expect(modalService.showModal).toHaveBeenCalledWith('signUp');
  });

  it('should call mockAuthService.signIn and close modal on successful login', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'Test@123' });
    mockAuthService.signIn.mockReturnValue(of({
      id: '1',
      token: '1',
      role: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      phoneNumber: '1234567890123',
      email: 'john@doe.com',
      password: 'Password123!',
      repeatedPassword: 'Password123!',
      newsletterConsent: false
    }));

    component.onSubmit();

    expect(mockAuthService.signIn).toHaveBeenCalled();
    expect(modalService.hideModal).toHaveBeenCalled();
    expect(component.serverError).toBe('');
  });

  it('should handle server error', () => {
    const errorMessage = 'Server error';
    mockAuthService.signIn.mockReturnValue(throwError(() => new Error(errorMessage)));

    component.loginForm.setValue({
      email: 'john@doe.com',
      password: 'Password123!'
    });

    component.onSubmit();
    expect(component.serverError).toBe(errorMessage);
  });
});
