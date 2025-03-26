import { NgModule } from '@angular/core';

import { urlInterceptor } from './interceptors/url.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from "@core/interceptors/auth.interceptor";

@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([urlInterceptor, authInterceptor])
    )
  ]
})
export class CoreModule {}
