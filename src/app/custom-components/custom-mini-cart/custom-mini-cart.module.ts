import { HelpSupportModule } from './../help-support/help-support.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMiniCartComponent } from './custom-mini-cart.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { CustomMiniCartMobileComponent } from './custom-mini-cart-mobile/custom-mini-cart-mobile.component';
import { MobileProductSearchModule } from '../mobile/m-search/m-product-search/mobile-product-search.module';



@NgModule({
  declarations: [CustomMiniCartComponent, CustomMiniCartMobileComponent],
  imports: [
    CommonModule,
    IconModule,
    MediaModule,
    UrlModule,
    RouterModule,
    HelpSupportModule,
    MobileProductSearchModule,
    ConfigModule.withConfig({
      cmsComponents: {
        MiniCartComponent: {
          component: CustomMiniCartComponent
        }
      }
    } as CmsConfig)
  ],
  exports: [
    CustomMiniCartComponent
  ]
})
export class CustomMiniCartModule { }
