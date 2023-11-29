import { CustomPdpModule } from './../custom-pdp/custom-pdp.module';
import { CustomProductModule } from './../custom-product/custom-product.module';
import { ConfigModule } from '@spartacus/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickOrderComponent } from './quick-order.component';
import { ItemCounterModule } from '@spartacus/storefront';
import { CustomItemcounterComponent } from './custom-itemcounter/custom-itemcounter.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';



@NgModule({
  declarations: [
    QuickOrderComponent,
    CustomItemcounterComponent
  ],
  imports: [
    CommonModule,
    CustomProductModule,
    CustomPdpModule,
    ItemCounterModule,
    SharedComponentsModule,
    ],
    exports: [
      CustomItemcounterComponent
    ]
  })
export class QuickOrderModule { }
