import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword: string = control.get('newPassword')?.value;
  const repeatedPassword: string = control.get('repeatedPassword')?.value;

  return newPassword && repeatedPassword && newPassword !== repeatedPassword
    ? { passwordsMismatch: true }
    : null;
};
