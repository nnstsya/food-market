import { HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  let token: string | null;

  try {
    token = localStorage.getItem('token');
  } catch (e) {
    token = null;
  }

  const headers: HttpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + token);

  const modifiedReq: HttpRequest<unknown> = req.clone({
    headers: headers,
  });
  return next(modifiedReq);
}
