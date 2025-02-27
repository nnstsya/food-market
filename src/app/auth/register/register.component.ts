import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ModalService } from '@shared/components/modal/modal.service';
import { AuthService } from '@auth/services/auth.service';
import { UserData } from '@auth/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs';
import { SignUpForm } from '@auth/models/form.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: '../../shared/components/modal/modal.component.scss',
})
export class RegisterComponent {
  passwordVisible: boolean = false;
  repeatedPasswordVisible: boolean = false;
  signUpForm: FormGroup<SignUpForm>;
  serverError: string = '';

  private modalService: ModalService = inject(ModalService);
  private authService: AuthService = inject(AuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      username: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
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
      repeatedPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*();:'",./|]).{6,}$/,
          ),
        ],
      ],
      newsletterConsent: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleRepeatedPasswordVisibility(): void {
    this.repeatedPasswordVisible = !this.repeatedPasswordVisible;
  }

  openLogInModal(): void {
    this.modalService.showModal('login');
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const user: UserData = { ...this.signUpForm.getRawValue() };

      if (user.password === user.repeatedPassword) {
        this.authService
          .signUp(user)
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
      } else {
        this.serverError =
          'Passwords must be identical. Please ensure both fields match.';
      }
    }
  }
}
