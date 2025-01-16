import { NgModule } from '@angular/core';

import { CommonModule, NgOptimizedImage, NgClass } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SkeletonDirective } from './directives/skeleton.directive';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [
    DropdownComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    CheckboxComponent,
    ProductCardComponent,
    SkeletonDirective
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    NgClass,
    ReactiveFormsModule
  ],
  exports: [
    DropdownComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    ProductCardComponent,
    SkeletonDirective,
    CheckboxComponent
  ],
})
export class SharedModule {}
