export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserPasswordRecovery {
  email: string;
  newPassword: string;
  repeatedPassword: string;
}

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  newsletterConsent: boolean;
  id: string;
  token: string;
}
