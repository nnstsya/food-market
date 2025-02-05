import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage, NgStyle } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';

@NgModule({
  declarations: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
    BannerComponent,
    BlogCardComponent
  ],
  exports: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
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
