import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Auth0CallbackComponent } from './auth0-callback.component';




@NgModule({
  declarations: [Auth0CallbackComponent],
  imports: [
    CommonModule,
  
    BrowserModule,
 
  ],
  exports: [
    Auth0CallbackComponent
  ]
})
export class Auth0CallBackModule { }
