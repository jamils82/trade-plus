import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactCustomerServiceComponent } from './contact-customer-service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FIConfirmationPopupModule } from 'src/app/custom-pages/popup-messages/fi-confirmation-popup/fi-confirmation-popup.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    FIConfirmationPopupModule
  ],
  exports: [ContactCustomerServiceComponent],
  declarations: [ContactCustomerServiceComponent]
})
export class ContactCustomerServiceModule { }
