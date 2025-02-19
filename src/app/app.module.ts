import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from '@layout/layout.module';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "@shared/shared.module";
import { HomeModule } from "@home/home.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    LayoutModule,
    HttpClientModule,
    SharedModule,
    HomeModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
