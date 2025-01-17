import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonComponent } from './components/button/button.component';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [
    ButtonComponent,
    BannerComponent,
    ListComponent
  ],
  exports: [
    BannerComponent,
    ButtonComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ],
})
export class SharedModule {}
