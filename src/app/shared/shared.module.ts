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
    ListComponent
  ],
  imports: [
    CommonModule,
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
    ListComponent
  ]
})
export class SharedModule {}
