import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs';
import { ModalService } from '@shared/components/modal/modal.service';
import { UserCredentials } from '@auth/models/user.model';
import { LoginForm } from '@auth/models/form.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: '../../shared/components/modal/modal.component.scss',
})
export class LoginComponent {
  passwordVisible: boolean = false;
  loginForm: FormGroup<LoginForm>;
  serverError: string = '';

  private modalService: ModalService = inject(ModalService);
  private authService: AuthService = inject(AuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*();:'",./|]).{6,}$/,
          ),
        ],
      ],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  openPasswordRecoveryModal(): void {
    this.modalService.showModal('passwordRecovery');
  }

  openSignUpModal(): void {
    this.modalService.showModal('signUp');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const user: UserCredentials = { ...this.loginForm.getRawValue() };

      this.authService
        .signIn(user)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((err: Error) => {
            this.serverError = err.message;
            return [];
          }),
        )
        .subscribe({
          next: () => {
            this.serverError = '';
            this.modalService.hideModal();
          },
        });
    }
  }
}
