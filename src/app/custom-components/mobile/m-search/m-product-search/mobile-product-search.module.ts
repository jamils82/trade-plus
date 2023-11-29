import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileProductSearchComponent } from './m-product-search.component';
import { SearchBoxModule } from '@spartacus/storefront';
import { FormsModule } from '@angular/forms';
import { CustomProductModule } from 'src/app/custom-components/custom-product/custom-product.module';



@NgModule({
  declarations: [MobileProductSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    SearchBoxModule,
    CustomProductModule
  ],
  exports: [MobileProductSearchComponent]
})
export class MobileProductSearchModule { }
