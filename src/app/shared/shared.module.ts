import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@NgModule({
  declarations: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
  ],
  exports: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ]
})
export class SharedModule {}
