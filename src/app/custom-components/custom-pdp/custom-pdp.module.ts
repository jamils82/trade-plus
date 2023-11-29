import { CustomSupportingDocumentsTabComponent } from './custom-product-tabs/custom-supporting-documents-tab/custom-supporting-documents-tab.component';
import { CustomWarrentyTabComponent } from './custom-product-tabs/custom-warrenty-tab/custom-warrenty-tab.component';
import { InStockAvailabilityComponent } from './in-stock-availability/in-stock-availability.component'
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomProductTabsComponent } from './custom-product-tabs/custom-product-tabs.component';
import { ConfigModule, CmsConfig, I18nModule } from '@spartacus/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProductIntoComponent } from './custom-product-into/custom-product-into.component';
import { OutletModule, PageComponentModule, MediaModule,StarRatingModule, ItemCounterModule } from '@spartacus/storefront';
import { CustomAddtocartComponent } from './custom-addtocart/custom-addtocart.component';
import { ProductPriceComponent } from './product-price/product-price.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { CustomSpectabComponent } from './custom-product-tabs/custom-spectab/custom-spectab.component';



@NgModule({
  declarations: [
    CustomProductIntoComponent,
    CustomProductTabsComponent,
    CustomAddtocartComponent,
    ProductPriceComponent,
   InStockAvailabilityComponent,
   CustomSpectabComponent,
   CustomWarrentyTabComponent,
   CustomSupportingDocumentsTabComponent
  ],
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    MediaModule, 
    ReactiveFormsModule,
    PageComponentModule,
    StarRatingModule,
    ItemCounterModule,
    SharedComponentsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSpecsTabComponent: {
          component: CustomSpectabComponent
        },
        ProductReviewsTabComponent: {
          component: CustomWarrentyTabComponent
        },
        CMSTabParagraphComponent: {
          component: CustomSupportingDocumentsTabComponent
        }
      }
    } as CmsConfig)
  ],
  exports: [
    CustomAddtocartComponent,
    ProductPriceComponent,
    InStockAvailabilityComponent
  ],
})
export class CustomPdpModule { }
