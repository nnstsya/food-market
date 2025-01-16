import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage, NgClass } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SkeletonDirective } from './directives/skeleton.directive';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    DropdownComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    ProductCardComponent,
    SkeletonDirective
  ],
  exports: [
    ButtonComponent,
    ProductCardComponent,
    DropdownComponent,
    ProductCardComponent,
    SkeletonDirective,
    InputComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    NgClass,
    ReactiveFormsModule,
  ]
})
export class SharedModule {}
