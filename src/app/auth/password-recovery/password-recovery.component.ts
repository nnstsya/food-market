import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ModalService } from '@shared/components/modal/modal.service';
import { AuthService } from '@auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs';
import { UserPasswordRecovery } from '@auth/models/user.model';
import { PasswordRecoveryForm } from '@auth/models/form.model';
import { passwordsMatchValidator } from "@auth/validators/password-match.validator";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrl: '../../shared/components/modal/modal.component.scss',
  standalone: false
})
export class PasswordRecoveryComponent {
  newPasswordVisible: boolean = false;
  repeatedPasswordVisible: boolean = false;
  passwordRecoveryForm: FormGroup<PasswordRecoveryForm>;
  serverError: string = '';

  private modalService: ModalService = inject(ModalService);
  private authService: AuthService = inject(AuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  constructor() {
    this.passwordRecoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*();:'",./|])[A-Za-z\d!@#$%^&*();:'",./|]{6,}$/,
          ),
        ],
      ],
      repeatedPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*();:'",./|])[A-Za-z\d!@#$%^&*();:'",./|]{6,}$/,
          ),
        ],
      ],
    },
    { validators: passwordsMatchValidator }
    );
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleRepeatedPasswordVisibility(): void {
    this.repeatedPasswordVisible = !this.repeatedPasswordVisible;
  }

  onSubmit(): void {
    if (this.passwordRecoveryForm.valid) {
      const user: UserPasswordRecovery = {
        ...this.passwordRecoveryForm.getRawValue(),
      };

      if (user.newPassword === user.repeatedPassword) {
        this.authService
          .resetPassword(user)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError((err: Error) => (this.serverError = err.message)),
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
}
