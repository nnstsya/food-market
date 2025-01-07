import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '@shared/shared.module';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    NgOptimizedImage
  ]
})
export class HomeModule {}
