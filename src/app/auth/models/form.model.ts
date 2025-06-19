import { FormControl } from '@angular/forms';

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface ProfileForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  newsletterConsent: FormControl<boolean>;
}

export interface PasswordRecoveryForm {
  email: FormControl<string>;
  newPassword: FormControl<string>;
  repeatedPassword: FormControl<string>;
}

export interface SignUpForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  password: FormControl<string>;
  repeatedPassword: FormControl<string>;
  newsletterConsent: FormControl<boolean>;
}
