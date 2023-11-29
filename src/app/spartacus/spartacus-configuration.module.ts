import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import { FeaturesConfig, I18nConfig, OccConfig, provideConfig, SiteContextConfig } from "@spartacus/core";
import { defaultB2bCheckoutConfig, defaultB2bOccConfig } from "@spartacus/setup";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [provideConfig(layoutConfig), provideConfig(mediaConfig), ...defaultCmsContentProviders, provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl:environment.siteUrl,
    //    prefix: '/occ/v2/'
        prefix: '/fletcherwebservices/v2/',
        endpoints: {
          // product: {
           
          //   attributes: 'products/${productCode}?fields=SPECIFICATIONS',
          // },
          productSearch:
              'products/search?fields=products(code,name,summary,manufacturer,productSupplierCode,showEmptyPrice,unit,addToCartDisabled,configurable,configuratorType,m2Price(FULL),price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery,categories',            
            },
      },
     
   },
  }), provideConfig(<SiteContextConfig>{
    context: {
    //   currency: ['USD'],
    //   language: ['en'],
    // //  urlParameters: ['baseSite',  'currency','language'],
    //   baseSite: [
    //     'electronics-spa',
    //   ],


      currency: ['AUD'],
      language: ['en_AU'],
     // urlParameters: ['baseSite'],
     //baseSite: ['fi-spa']
       baseSite: ['tradeLink-spa']
    },
    
  }), provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }), provideConfig(<FeaturesConfig>{
    features: {
      level: '4.0'
    }
  }), provideConfig(defaultB2bOccConfig), provideConfig(defaultB2bCheckoutConfig)]
})
export class SpartacusConfigurationModule { }
