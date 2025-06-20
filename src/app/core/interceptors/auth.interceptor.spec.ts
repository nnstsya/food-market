import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  const mockHandler = jest.fn().mockReturnValue(of({}));

  beforeEach(() => {
    localStorage.clear();
  });

  it('should add Authorization header when user is logged in', () => {
    localStorage.setItem('token', 'test-token');

    const request = new HttpRequest('GET', '/test');

    authInterceptor(request, mockHandler);

    const modifiedRequest = mockHandler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should handle missing user data', () => {
    const request = new HttpRequest('GET', '/test');

    authInterceptor(request, mockHandler);

    const modifiedRequest = mockHandler.mock.calls[0][0];
    expect(modifiedRequest.headers.get('Authorization')).toBe('Bearer null');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
