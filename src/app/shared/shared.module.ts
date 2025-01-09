import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';

@NgModule({
  declarations: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent
  ],
  imports: [
    NgOptimizedImage,
    NgStyle
  ],
  exports: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent
  ]
})
export class SharedModule {}
