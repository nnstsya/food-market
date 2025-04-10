import { HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { User } from "@auth/models/user.model";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const storedUserData: User | null = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null;

  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + storedUserData?.token);

  const modifiedReq: HttpRequest<unknown> = req.clone({
    headers: headers,
  });
  return next(modifiedReq);
}
