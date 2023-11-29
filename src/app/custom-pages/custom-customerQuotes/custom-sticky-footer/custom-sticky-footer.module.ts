import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomStickyFooterComponent } from './custom-sticky-footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendQuotePopupComponent } from '../view-quote/send-quote-popup/send-quote-popup.component';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [
    CustomStickyFooterComponent,SendQuotePopupComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    MatChipsModule
    
  ],
  exports: [CustomStickyFooterComponent],
})
export class CustomStickyFooterModule { }
