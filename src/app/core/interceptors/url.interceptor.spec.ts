import { HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';
import { urlInterceptor } from './url.interceptor';
import { of } from 'rxjs';

describe('urlInterceptor', () => {
  const mockHandler = jest.fn().mockReturnValue(of({}));

  it('should prepend baseUrl for relative URLs', () => {
    const request = new HttpRequest('GET', '/products');

    urlInterceptor(request, mockHandler);

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${environment.baseUrl}/api/products`
      })
    );
  });

  it('should not modify absolute URLs', () => {
    const absoluteUrl = 'https://external-api.com/data';
    const request = new HttpRequest('GET', absoluteUrl);

    urlInterceptor(request, mockHandler);

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: absoluteUrl
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
