import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if(!req.url.startsWith('http')) {
    const modifiedReq: HttpRequest<unknown> = req.clone({
      url: `${environment.baseUrl}${req.url}`
    });
    return next(modifiedReq);
  }

  return next(req);
}
