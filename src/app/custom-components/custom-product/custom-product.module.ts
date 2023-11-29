import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, ListNavigationModule, MediaModule, ProductFacetNavigationModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { UrlModule, I18nModule, ConfigModule, CmsConfig } from '@spartacus/core';
import { CustomProductComponent } from './custom-product.component';
import { CustomPlpGridComponent } from './custom-plp-grid/custom-plp-grid.component';
import { CustomPlpListComponent } from './custom-plp-list/custom-plp-list.component';
import { CustomProductTabsComponent } from '../custom-pdp/custom-product-tabs/custom-product-tabs.component';
import { CustomProductIntoComponent } from '../custom-pdp/custom-product-into/custom-product-into.component';
import { CustomPdpModule } from '../custom-pdp/custom-pdp.module';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [CustomProductComponent, CustomPlpGridComponent, CustomPlpListComponent, ProductSearchComponent],
  imports: [
    CommonModule,
    MediaModule,
    UrlModule,
    RouterModule,
    I18nModule,
    ListNavigationModule,
    CustomPdpModule,
    ProductFacetNavigationModule,
    IconModule,
    SharedComponentsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductGridComponent: {
          component: CustomProductComponent

        },
        ProductIntroComponent: {
          component: CustomProductIntoComponent
        },
        ProductSummaryComponent: {
          component: null
        },
        ProductAddToCartComponent: {
          component: null,
        },
        SearchResultsGridComponent: {
          component: CustomProductComponent,
        },


        CMSTabParagraphContainer: {
          component: CustomProductTabsComponent
        }

      },
      pagination: {
        addPrevious: true,
        addStart: false,
        addNext: true,
        addEnd: false
      }
    } as CmsConfig),

  ],
  providers: [
    ProductHelpService,
    NgbModal
  ],
  exports: [
    ProductSearchComponent
  ]
})
export class CustomProductModule { }

