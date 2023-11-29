import { HelpSupportModule } from './../help-support/help-support.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopaccountComponent } from './topaccount.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { IconModule, MediaModule,NavigationComponent } from '@spartacus/storefront';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustombreadcrubComponent } from './custombreadcrub/custombreadcrub.component';




@NgModule({
  declarations: [TopaccountComponent, CustombreadcrubComponent],
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    MediaModule,
    IconModule,
    HelpSupportModule,
    NgbModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TPUserAccountDropDown: {
          component: TopaccountComponent,
        },
        BreadcrumbComponent: {
          component: CustombreadcrubComponent,
        },
      },
    } as CmsConfig)
  ]
})
export class TopaccountModule { }
