import { NgModule } from '@angular/core';

import { urlInterceptor } from './interceptors/url.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

@NgModule({
  providers: [
    provideHttpClient(
      withInterceptors([urlInterceptor])
    )
  ]
})
export class CoreModule {}
