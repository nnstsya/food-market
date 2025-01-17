import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from "@shared/components/button/button.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    DropdownComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent
  ],
  imports: [
    NgOptimizedImage,
    NgClass,
    ReactiveFormsModule,
  ],
  exports: [
    DropdownComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent
  ]
})
export class SharedModule {}
