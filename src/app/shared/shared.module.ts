import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SkeletonDirective } from './directives/skeleton.directive';

@NgModule({
  declarations: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
    SkeletonDirective,
  ],
  exports: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
    ProductCardComponent,
    SkeletonDirective
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ]
})
export class SharedModule {}
