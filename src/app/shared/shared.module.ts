import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { CommonModule, DecimalPipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "@shared/components/button/button.component";
import { ProductCardComponent } from "@shared/components/product-card/product-card.component";
import { TagComponent } from './components/tag/tag.component';
import { InputComponent } from "@shared/components/input/input.component";
import { TabsComponent } from './components/tabs/tabs.component';
import { ModalComponent } from "@shared/components/modal/modal.component";

@NgModule({
  declarations: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    InputComponent,
    TabsComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    DecimalPipe,
    NgClass
  ],
  exports: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    InputComponent,
    TabsComponent,
    ModalComponent
  ]
})
export class SharedModule {}
