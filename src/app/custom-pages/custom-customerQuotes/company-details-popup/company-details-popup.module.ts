import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDetailsPopupComponent } from './company-details-popup.component';
import { CustomJobAddressModule } from 'src/app/custom-components/custom-customerQuotes/custom-job-address/custom-job-address.module';
import { OutletModule, OutletRefModule } from '@spartacus/storefront';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CompanyDetailsPopupComponent,
    
  ],
  imports: [
    CommonModule,
    OutletModule,
    OutletRefModule,
    FormsModule,
    ReactiveFormsModule,
    CustomJobAddressModule
  ],
  exports: [CompanyDetailsPopupComponent],
})
export class CompanyDetailsPopupModule { }
