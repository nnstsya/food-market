import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    LoginComponent,
    PasswordRecoveryComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent,
    PasswordRecoveryComponent,
    RegisterComponent
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AuthModule {}
