import { NgModule } from '@angular/core';
import { BaseStorefrontModule } from "@spartacus/storefront";
import { SpartacusConfigurationModule } from './spartacus-configuration.module';
import { SpartacusFeaturesModule } from './spartacus-features.module';
import { AuthConfig, ConfigModule, DeferLoadingStrategy, provideConfig, SearchboxService } from "@spartacus/core";
import { LayoutConfig, ProductListComponentService } from "@spartacus/storefront";
@NgModule({
  declarations: [],
  imports: [
    ConfigModule.withConfig({
      layoutSlots: {
        LandingPage2Template: {
           slots: [
        'Section1',
        'Section1',

        // 'Section2A',
        // 'Section2B',
        // 'Section2C',
        // 'Section3',
        // 'Section4',
        // 'Section5',
      ],
        },
        header: {
          lg: {
            slots: [  'SiteLogo', 'SiteLogin', 'MiniCart', 'NavigationBar', 'SearchBox', 'QuickOrderButtonSlot', 'RequestQuoteButtonSlot']
          },
          xs: {
            slots: ['SiteLogo', 'SiteLogin', 'MiniCart','TLMobSiteLogoSlot', 'QuickOrderButtonSlot', 'RequestQuoteButtonSlot']
          }
        },
        footer: {
          lg: {
            slots: ['Footer']
          },
          md: {
            slots: ['Footer']
          },
          sm: {
            slots: ['Footer']
          },
          xs: {
            slots: ['Footer']
          }
        },
        LoginPageTemplate :{
          

        }

      },
      routing: {
        //  protected: true,
        //  routes: {
        //   contact: {
        //       paths: ['contact'],
        //       protected: false // make the contact route public
        //   }
        // }
      }
    } as LayoutConfig),
    

    SpartacusFeaturesModule,
    SpartacusConfigurationModule,
    BaseStorefrontModule
  ],
  exports: [BaseStorefrontModule]
})
export class SpartacusModule { }
