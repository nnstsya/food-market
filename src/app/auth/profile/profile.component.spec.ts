import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { of, throwError } from 'rxjs';
import { User } from '@auth/models/user.model';
import { SharedModule } from "@shared/shared.module";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jest.Mocked<AuthService>;
  let toastService: jest.Mocked<ToastService>;

  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@email.com',
    phoneNumber: '1234567890123',
    token: 'mock-token',
    role: 'user',
    newsletterConsent: false
  };

  beforeEach(async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(mockUser)),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    authService = {
      updateProfile: jest.fn(),
      logout: jest.fn()
    } as any;

    toastService = {
      show: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [ProfileComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data', () => {
    expect(component.profileForm.getRawValue()).toEqual({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      username: mockUser.username,
      email: mockUser.email,
      phoneNumber: mockUser.phoneNumber,
      newsletterConsent: mockUser.newsletterConsent
    });
  });

  it('should not submit if form is unchanged', () => {
    authService.updateProfile.mockReturnValue(of(mockUser));
    component.onSubmit();
    expect(authService.updateProfile).not.toHaveBeenCalled();
  });

  it('should submit if form is changed and valid', () => {
    const updatedUser = { ...mockUser, firstName: 'Jane' };
    component.profileForm.patchValue({ firstName: 'Jane' });
    authService.updateProfile.mockReturnValue(of(updatedUser));

    component.onSubmit();

    expect(authService.updateProfile).toHaveBeenCalledWith({
      ...component.profileForm.getRawValue(),
      id: mockUser.id,
      token: mockUser.token
    });
    expect(toastService.show).toHaveBeenCalledWith('Profile updated successfully!', 'success');
  });

  it('should handle error on submit', () => {
    component.profileForm.patchValue({ firstName: 'Jane' });
    const errorMessage = 'Update failed';
    authService.updateProfile.mockReturnValue(throwError(() => new Error(errorMessage)));

    component.onSubmit();

    expect(component.serverError).toBe(errorMessage);
  });

  it('should call logout', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should validate firstName format', () => {
    const control = component.profileForm.get('firstName');
    control?.setValue('John123');
    expect(control?.valid).toBeFalsy();

    control?.setValue('John');
    expect(control?.valid).toBeTruthy();
  });
});
