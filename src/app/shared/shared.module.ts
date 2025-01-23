import { NgModule } from '@angular/core';

import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DecimalPipe, NgClass, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "@shared/components/button/button.component";
import { ProductCardComponent } from "@shared/components/product-card/product-card.component";
import { TagComponent } from './components/tag/tag.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    DropdownComponent,
    BannerComponent,
    BlogCardComponent,
    BreadcrumbsComponent,
    ButtonComponent,
    ProductCardComponent,
    TagComponent,
    PaginationComponent
  ],
  imports: [
    NgOptimizedImage,
    NgStyle,
    NgIf,
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
    PaginationComponent
  ]
})
export class SharedModule {}
