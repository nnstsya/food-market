import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from '@layout/layout.module';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@core/core.module';
import { HomeModule } from "@home/home.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    LayoutModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    CoreModule,
    HomeModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
