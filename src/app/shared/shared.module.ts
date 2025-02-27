import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DecimalPipe, NgClass, NgIf, CommonModule, NgOptimizedImage, NgStyle } from '@angular/common';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "@shared/components/button/button.component";
import { ProductCardComponent } from "@shared/components/product-card/product-card.component";
import { TagComponent } from './components/tag/tag.component';
import { ListComponent } from './components/list/list.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ModalComponent } from './components/modal/modal.component';
import { InputComponent } from './components/input/input.component';


@NgModule({
  declarations: [
    DropdownComponent,
    ButtonComponent,
    BannerComponent,
    BlogCardComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    ListComponent,
    ModalComponent,
    InputComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    NgStyle,
    NgIf,
    RouterLink,
    DecimalPipe,
    NgClass,
    ReactiveFormsModule
  ],
  exports: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    ListComponent,
    ModalComponent,
    InputComponent
  ]
})
export class SharedModule {}
