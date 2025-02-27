import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  User,
  UserCredentials,
  UserData,
  UserPasswordRecovery,
} from '../models/user.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private API_URL: string = 'http://localhost:3000/api/users';

  signIn(userCredentials: UserCredentials): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, userCredentials).pipe(
      tap((response: User) => this.storeUserData(response)),
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.error || 'Login failed due to a server error.',
            ),
        ),
      ),
    );
  }

  signUp(user: UserData): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, user).pipe(
      tap((response: User) => this.storeUserData(response)),
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.error || 'Sign up failed due to a server error.',
            ),
        ),
      ),
    );
  }

  resetPassword(
    userWithNewPassword: UserPasswordRecovery,
  ): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.API_URL}/reset-password`, userWithNewPassword)
      .pipe(
        catchError((err) =>
          throwError(
            () =>
              new Error(
                err?.error.error ||
                  'Password reset failed due to a server error.',
              ),
          ),
        ),
      );
  }

  private storeUserData(user: User): void {
    const userData: User = { ...user };

    localStorage.setItem('user', JSON.stringify(userData));
  }
}
