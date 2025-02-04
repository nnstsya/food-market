import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DecimalPipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "@shared/components/button/button.component";
import { ProductCardComponent } from "@shared/components/product-card/product-card.component";
import { TagComponent } from './components/tag/tag.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CheckboxComponent } from "@shared/components/checkbox/checkbox.component";
import { RangeComponent } from './components/range/range.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "@shared/components/input/input.component";
import { FilterComponent } from './components/filter/filter.component';

@NgModule({
  declarations: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent,
    CheckboxComponent,
    RangeComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    PaginationComponent,
    InputComponent,
    FilterComponent
  ],
  imports: [
    NgOptimizedImage,
    NgStyle,
    RouterLink,
    DecimalPipe,
    ReactiveFormsModule,
    NgClass,
    FormsModule
  ],
  exports: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent,
    CheckboxComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    RangeComponent,
    PaginationComponent,
    InputComponent,
    FilterComponent
  ]
})
export class SharedModule {}
