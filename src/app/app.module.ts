import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { CanDeactivateGuard } from '../can-deactivate/can-deactivate.guard';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, FormsModule, HttpModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }, CanDeactivateGuard]
})
export class AppModule {}
