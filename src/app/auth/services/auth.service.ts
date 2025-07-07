import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  User,
  UserCredentials,
  UserData,
  UserPasswordRecovery,
} from '../models/user.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private basePath: string = '/auth';
  private authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));

  isAuthenticated$: Observable<boolean> = this.authState.asObservable();

  signIn(userCredentials: UserCredentials): Observable<User> {
    return this.http.post<User>(`${this.basePath}/login`, userCredentials).pipe(
      tap((response: User) => {
        this.storeUserData(response);
        this.storeUserToken(response.token);
      }),
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message || 'Login failed due to a server error.',
            ),
        ),
      ),
    );
  }

  signUp(user: UserData): Observable<User> {
    return this.http.post<User>(`${this.basePath}/register`, user).pipe(
      tap((response: User) => {
        this.storeUserData(response);
        this.storeUserToken(response.token);
      }),
      catchError((err) =>
        throwError(
          () =>
            new Error(
              err?.error.message || 'Sign up failed due to a server error.',
            ),
        ),
      ),
    );
  }

  resetPassword(
    userWithNewPassword: UserPasswordRecovery,
  ): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.basePath}/reset-password`, userWithNewPassword)
      .pipe(
        catchError((err) =>
          throwError(
            () =>
              new Error(
                err?.error.message ||
                  'Password reset failed due to a server error.',
              ),
          ),
        ),
      );
  }

  private storeUserToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private storeUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));

    this.authState.next(true);
  }
}
