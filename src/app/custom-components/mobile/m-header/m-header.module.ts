import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MHamburgermenuopenComponent } from './m-hamburgermenuopen/m-hamburgermenuopen.component';
import { MHeaderComponent } from './m-header/m-header.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { AccountdropdownModule } from '../../header/accountdropdown/accountdropdown.module';
import { ContactusModule } from '../../contactus/contactus.module';
import { HelpSupportModule } from '../../help-support/help-support.module';
import { MAccountdropdownComponent } from './m-accountdropdown/m-accountdropdown.component';
import { RouterModule } from '@angular/router';
import { IconModule, MediaModule } from '@spartacus/storefront';
import { CustomMiniCartModule } from '../../custom-mini-cart/custom-mini-cart.module';
import { MobileProductSearchModule } from '../m-search/m-product-search/mobile-product-search.module';




@NgModule({
  declarations: [MHamburgermenuopenComponent, MHeaderComponent, MAccountdropdownComponent],
  imports: [
    CommonModule,
    UrlModule,
    MediaModule,
    IconModule,
    ConfigModule.withConfig({
      cmsComponents: {
        FIMobileHeaderFlexComponent: {
          component: MHeaderComponent,
        },
      },
  } as CmsConfig),  
    AccountdropdownModule,
    ContactusModule,
    HelpSupportModule,
    AccountdropdownModule,
    CustomMiniCartModule,
    RouterModule,
    MobileProductSearchModule
  ],
  exports: [MHamburgermenuopenComponent],
})
export class MHeaderModule { }
