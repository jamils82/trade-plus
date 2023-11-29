import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainsectionComponent } from './home-mainsection.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [HomeMainsectionComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    ConfigModule.withConfig({
      cmsComponents: {
        SimpleResponsiveBannerComponent: {
          component: HomeMainsectionComponent
        }
      }
    } as CmsConfig)
  ]
})
export class HomeMainsectionModule { }
