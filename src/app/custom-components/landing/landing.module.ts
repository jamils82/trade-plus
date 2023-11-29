import { HelpSupportModule } from './../help-support/help-support.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { IconModule, MediaModule,NavigationComponent } from '@spartacus/storefront';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingComponent } from './landing.component';




@NgModule({
  declarations: [LandingComponent],
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
        TLAuthLandingPageComponent: {
          component: LandingComponent,
        },
      },
    } as CmsConfig)
  ]
})
export class LandingModule { }