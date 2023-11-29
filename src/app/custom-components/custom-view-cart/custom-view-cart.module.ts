import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CarddetailComponent } from './carddetail.component';
import { CmsConfig, ConfigModule, FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { CartCouponModule, CartSharedModule, IconModule, ItemCounterModule, ListNavigationModule, MediaModule, OutletModule, PromotionsModule } from '@spartacus/storefront';
import { CustomCartListComponent } from './custom-cart-list/custom-cart-list.component';
import { CustomCartItemComponent } from './custom-cart-list/custom-cart-item/custom-cart-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomPdpModule } from '../custom-pdp/custom-pdp.module';
import { CustomCartTotalComponent } from './custom-cart-total/custom-cart-total.component';
import { CustomOrderSummaryComponent } from './custom-cart-total/custom-order-summary/custom-order-summary.component';
import { MatIconModule } from '@angular/material/icon';
import { CustomDeleteCartItemComponent } from './custom-cart-list/custom-delete-cart-item/custom-delete-cart-item.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [
    CarddetailComponent,
    CustomCartListComponent,
    CustomCartItemComponent,
    CustomCartTotalComponent,
    CustomOrderSummaryComponent,
    CustomDeleteCartItemComponent,
  ], 
  imports: [
    CommonModule,
    CartSharedModule,
    CartCouponModule,
    SharedComponentsModule,
    //RouterModule,
    RouterModule,
    ListNavigationModule,
    PromotionsModule,
    MediaModule,
    FeaturesConfigModule,
    ItemCounterModule,
    I18nModule,
    IconModule,
    MatIconModule,
    NgbModule,
    UrlModule,
    CustomPdpModule,

    ReactiveFormsModule,

    OutletModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CartComponent: {
          component: CarddetailComponent

        },

        CartTotalsComponent: {
          component: CustomCartTotalComponent

        },





      }
    } as CmsConfig)

  ],
  exports: [CustomCartItemComponent],
  providers:[NgbModal]
})
export class CustomViewCartModule { }
