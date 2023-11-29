import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestquoteComponent } from './requestquote/requestquote.component';

import { CustomProductModule } from '../custom-product/custom-product.module';
import { FormsModule } from '@angular/forms';
import { ItemCounterModule, SearchBoxModule } from '@spartacus/storefront';
import { CustomPdpModule } from '../custom-pdp/custom-pdp.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { CustomItemcounterComponent } from '../quick-order/custom-itemcounter/custom-itemcounter.component';
import { QuickOrderModule } from '../quick-order/quick-order.module';
import { ChnageQuotePopupComponent } from './requestquote/chnage-quote-popup/chnage-quote-popup.component';

import { DemoMaterialModule } from '../../../app/custom-pages/custom-ordercheckout/material.module'
import { Routes } from '@angular/router';

// const routes: Routes = [
//   { path: '/tpRequestQuotePage', component: RequestquoteComponent},
//   { path: '', component: RequestquoteComponent  }
// ];

@NgModule({
  declarations: [
    RequestquoteComponent,
    ChnageQuotePopupComponent,
    
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    QuickOrderModule,
    CustomProductModule,
    CustomPdpModule,
    ItemCounterModule,
    SharedComponentsModule,

  ]
})
export class RequestQuoteModModule { }
