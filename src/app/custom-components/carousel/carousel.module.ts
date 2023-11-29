import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { CmsConfig, ConfigModule, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { CarouselModule, BannerCarouselModule, IconModule, MediaModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { CarouselDetailComponent } from './carousel-detail/carousel-detail.component';



@NgModule({
  declarations: [
    CarouselComponent,
    CarouselDetailComponent
  ],
  exports: [
    CarouselComponent
  ],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    CarouselModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        RotatingImagesComponent: {
          component: CarouselComponent
        }
      }
    } as CmsConfig)
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        RotatingImagesComponent: {
          component: CarouselComponent,
        },
      },
    } as CmsConfig),
  ],
})
export class CarouselCompModule { }
