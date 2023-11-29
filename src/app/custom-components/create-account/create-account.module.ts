import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account.component';
import { MediaModule } from '@spartacus/storefront';



@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    MediaModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  exports: [
    CreateAccountComponent
  ]
})
export class CreateAccountModule { }
