import { FormGroup, FormControl } from '@angular/forms';
import { passwordsMatchValidator } from './password-match.validator';

describe('PasswordsMatchValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      newPassword: new FormControl(''),
      repeatedPassword: new FormControl('')
    });
  });

  it('should return null when passwords match', () => {
    formGroup.patchValue({
      newPassword: 'Password123!',
      repeatedPassword: 'Password123!'
    });

    const result = passwordsMatchValidator(formGroup);
    expect(result).toBeNull();
  });

  it('should return error when passwords do not match', () => {
    formGroup.patchValue({
      newPassword: 'Password123!',
      repeatedPassword: 'DifferentPassword123!'
    });

    const result = passwordsMatchValidator(formGroup);
    expect(result).toEqual({ passwordsMismatch: true });
  });
});
