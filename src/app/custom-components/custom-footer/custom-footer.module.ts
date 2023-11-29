import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFooterComponent } from './custom-footer.component';
import { ConfigModule, CmsConfig, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CustomFooterComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TPFollowUsOn: {
          component: CustomFooterComponent
        }
      }
    } as CmsConfig)
  ]
})
export class CustomFooterModule { }
