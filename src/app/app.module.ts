import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'
import { jwtInterceptor } from './core/guards/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideHttpClient(),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useValue: jwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
