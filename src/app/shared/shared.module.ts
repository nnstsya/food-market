import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from "@shared/components/button/button.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ModalComponent } from './components/modal/modal.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [
    DropdownComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    CheckboxComponent,
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
    ModalComponent,
    CheckboxComponent,
  ],
})
export class SharedModule {}
