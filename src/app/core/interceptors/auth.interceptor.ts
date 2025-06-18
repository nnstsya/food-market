import { HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { User } from "@auth/models/user.model";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  let storedUserData: User | null;
  try {
    const userJson = localStorage.getItem('user');
    storedUserData = userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    storedUserData = null;
  }

  const headers: HttpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + storedUserData?.token);

  const modifiedReq: HttpRequest<unknown> = req.clone({
    headers: headers,
  });
  return next(modifiedReq);
}
