import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent
  ],
  exports: [
    CardComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
