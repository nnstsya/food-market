import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from '@home/home-page/home-page.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomePageComponent,
  ],
  imports: [
    HomeRoutingModule
  ]
})
export class HomeModule {}
