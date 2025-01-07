import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    BannerComponent
  ],
  exports: [
    BannerComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
