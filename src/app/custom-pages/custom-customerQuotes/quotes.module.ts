import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutletModule, OutletRefModule } from '@spartacus/storefront';
import { CreateNewQuotesPopupComponent } from './create-new-quotes-popup/create-new-quotes-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCancelPopupComponent } from '../../custom-components/custom-customerQuotes/custom-cancel-popup/custom-cancel-popup.component';
import { CustomJobAddressModule } from '../../custom-components/custom-customerQuotes/custom-job-address/custom-job-address.module';
import { CompanyDetailsPopupComponent } from './company-details-popup/company-details-popup.component';
import { CompanyDetailsPopupModule } from './company-details-popup/company-details-popup.module';
import { QuotesComponent } from './quotes.component';
import { RouterModule } from '@angular/router';
import { PaginationModule } from '@spartacus/storefront';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    CreateNewQuotesPopupComponent, 
    CustomCancelPopupComponent, 
    QuotesComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    OutletModule,
    OutletRefModule,
    FormsModule,
    ReactiveFormsModule,
    CustomJobAddressModule,
    CompanyDetailsPopupModule,
    PaginationModule
  ],
  exports: [CompanyDetailsPopupComponent, QuotesComponent],

})
export class QuotesModule { }
