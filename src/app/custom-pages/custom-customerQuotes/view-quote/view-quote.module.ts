import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomStickyFooterModule } from '../custom-sticky-footer/custom-sticky-footer.module';
import { ViewQuoteComponent } from './view-quote.component';
import { CompanyDetailsPopupModule } from '../company-details-popup/company-details-popup.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ViewQuoteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CustomStickyFooterModule,
    CompanyDetailsPopupModule,
    MatSlideToggleModule
  ]
})
export class ViewQuoteModule { }
