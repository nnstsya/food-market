import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs';
import { User } from '@auth/models/user.model';
import { ProfileForm } from "@auth/models/form.model";
import { ToastService } from "@shared/components/toast/toast.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent {
  profileForm: FormGroup<ProfileForm>;
  serverError: string = '';
  currentUser: User = JSON.parse(localStorage.getItem('user')!);

  private toastService: ToastService = inject(ToastService);
  private authService: AuthService = inject(AuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      username: [this.currentUser.username, [Validators.required]],
      phoneNumber: [this.currentUser.phoneNumber, [Validators.required, Validators.pattern(/^\d{13}$/)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      newsletterConsent: [this.currentUser.newsletterConsent]
    });
  }

  private hasFormChanged(): boolean {
    const currentValues = this.profileForm.getRawValue();
    return Object.keys(currentValues).some(key => {
      return currentValues[key as keyof typeof currentValues] !==
             this.currentUser[key as keyof typeof currentValues];
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      if (!this.hasFormChanged()) {
        return;
      }

      const userData: Omit<User, 'role'> = {
        ...this.profileForm.getRawValue(),
        id: this.currentUser.id,
        token: this.currentUser.token
      };

      this.authService.updateProfile(userData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((err: Error) => {
            this.serverError = err.message;
            return [];
          })
        )
        .subscribe({
          next: () => {
            this.serverError = '';
            this.currentUser = JSON.parse(localStorage.getItem('user')!);
            this.toastService.show('Profile updated successfully!', 'success');
          }
        });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
