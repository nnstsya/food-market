import {FormControl} from "@angular/forms";

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface PasswordRecoveryForm {
  email: FormControl<string>;
  newPassword: FormControl<string>;
  repeatedPassword: FormControl<string>;
}
