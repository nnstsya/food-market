import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UserCredentials, UserData, UserPasswordRecovery } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const mockLocalStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    };

    jest.spyOn(window, 'localStorage', 'get').mockReturnValue(mockLocalStorage);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign in user', () => {
    const credentials: UserCredentials = {
      email: 'test@email.com',
      password: 'Test123!'
    };

    const mockResponse = {
      ...credentials,
      id: '1',
      token: 'mock-token'
    };

    service.signIn(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should sign up user', () => {
    const userData: UserData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@email.com',
      phoneNumber: '1234567890123',
      password: 'Test123!',
      repeatedPassword: 'Test123!',
      newsletterConsent: false
    };

    const mockResponse = {
      ...userData,
      id: '1',
      token: 'mock-token'
    };

    service.signUp(userData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should reset password', () => {
    const resetData: UserPasswordRecovery = {
      email: 'test@email.com',
      newPassword: 'NewTest123!',
      repeatedPassword: 'NewTest123!'
    };

    service.resetPassword(resetData).subscribe(response => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne('/auth/reset-password');
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should handle error responses', () => {
    const credentials: UserCredentials = {
      email: 'test@email.com',
      password: 'wrong'
    };

    service.signIn(credentials).subscribe({
      error: (error) => {
        expect(error.message).toBe('Login failed due to a server error.');
      }
    });

    const req = httpMock.expectOne('/auth/login');
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle signup error responses', () => {
    const userData: UserData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@email.com',
      phoneNumber: '1234567890123',
      password: 'Test123!',
      repeatedPassword: 'Test123!',
      newsletterConsent: false
    };

    service.signUp(userData).subscribe({
      error: (error) => {
        expect(error.message).toBe('Sign up failed due to a server error.');
      }
    });

    const req = httpMock.expectOne('/auth/register');
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle password reset error responses', () => {
    const resetData: UserPasswordRecovery = {
      email: 'test@email.com',
      newPassword: 'NewTest123!',
      repeatedPassword: 'NewTest123!'
    };

    service.resetPassword(resetData).subscribe({
      error: (error) => {
        expect(error.message).toBe('Password reset failed due to a server error.');
      }
    });

    const req = httpMock.expectOne('/auth/reset-password');
    req.error(new ErrorEvent('Network error'));
  });

  it('should store user data in localStorage after successful login', () => {
    const credentials: UserCredentials = {
      email: 'test@email.com',
      password: 'Test123!'
    };

    const mockResponse = {
      ...credentials,
      id: '1',
      token: 'mock-token'
    };

    service.signIn(credentials).subscribe();

    const req = httpMock.expectOne('/auth/login');
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse));
  });
});
