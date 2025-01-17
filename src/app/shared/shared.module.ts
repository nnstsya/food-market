import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [
    ButtonComponent,
    ProductCardComponent,
    ListComponent
  ],
  exports: [
    ButtonComponent,
    ProductCardComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ]
})
export class SharedModule {}
