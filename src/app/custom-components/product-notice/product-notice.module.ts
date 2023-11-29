import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule } from '@spartacus/core';

import { CustomProductNoticeLinkComponent } from './product-notice-alert/product-notice-link.component';
import { CustomProductNoticeComponent } from './custom-product-notice.component';

@NgModule({
  declarations: [CustomProductNoticeLinkComponent, CustomProductNoticeComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductNoticeLinkComponent: {
          component : CustomProductNoticeLinkComponent
        }
      },
    } as CmsConfig)
  ],
  exports: []
})
export class ProductNoticePageModule { }
