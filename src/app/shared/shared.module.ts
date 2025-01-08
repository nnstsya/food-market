import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    DropdownComponent
  ],
  imports: [
    NgOptimizedImage
  ],
  exports: [
    DropdownComponent
  ]
})
export class SharedModule {}
