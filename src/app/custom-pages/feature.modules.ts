import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { ProductfacetsModule } from '../../custom-pages/products/productfacets/productfacets.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductfacetsModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        productList: {
          module: () =>
            import('../../custom-pages/products/products.module').then(
              (m) => m.ProductsModule
            ),
          cmsComponents: ['ProductGridComponent', 'SearchResultsGridComponent'],
        },
      },
    }),
  ],
})
export class FifeatureModule {}
