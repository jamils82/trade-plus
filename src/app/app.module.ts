import { QuickOrderModule } from './custom-components/quick-order/quick-order.module';
import { CustomPdpModule } from './custom-components/custom-pdp/custom-pdp.module';
import { ProductNoticePageModule } from './custom-components/product-notice/product-notice.module';
import { CustomFooterModule } from './custom-components/custom-footer/custom-footer.module';
import { FindStoreService } from 'src/app/core/service/findStore.service';
import { HelpSupportModule } from './custom-components/help-support/help-support.module';
import { HomeMainsectionModule } from './custom-components/home-mainsection/home-mainsection.module';
import { CreateAccountModule } from './custom-components/create-account/create-account.module';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';
import { SpartacusAuth0ModuleConfig } from './shared/thirdparty/spartacusauth0.config';
import { AuthInterceptor } from './shared/interceptor/global-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomMiniCartModule } from 'src/app/custom-components/custom-mini-cart/custom-mini-cart.module';
import { CustomLayoutRoutingModule } from 'src/app/core/config/custom-layout/custom-layout.module';
import { CreateAccountService } from './core/service/createAccount.service';
import { Auth0TokenService } from 'src/app/core/service/token.service';
import { Auth0CallBackModule } from './custom-components/autho.callback/auth0-callback.module';
import { customCmsGaurd } from './core/guard/custom-cms-page.guard';
import { FIUserAccountDetailsService } from './core/service/userAccountDetails.service';
import { Auth0ModuleConfig } from './shared/thirdparty/auth0.config';
import { AccountdropdownModule } from './custom-components/header/accountdropdown/accountdropdown.module';
import { ShareEvents } from './shared/shareEvents.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';

import { TopaccountModule } from 'src/app/custom-components/topaccount/topaccount.module';
import { CustomNavigationModule } from './custom-components/custom-navigation/custom-navigation.module';
import { CustomMyteamModule } from './custom-components/custom-myteam/custom-myteam.module';
import { CustomProductModule } from './custom-components/custom-product/custom-product.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductfacetsModule } from './custom-components/custom-product/productfacets/productfacets.module';
import { CustomViewCartModule } from './custom-components/custom-view-cart/custom-view-cart.module';
import { CartItemContextSource, FacetService } from '@spartacus/storefront';
import { TokenValidator } from './shared/interceptor/token-validator-interceptor';
import { CustomOrderCheckoutModule } from './custom-pages/custom-order_checkout_summary.module';
import { AccountModule } from './custom-pages/account/account.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { AccountPaymentService } from './core/service/account-payments.service';
import { LandingComponent } from './custom-components/landing/landing.component';
import { LandingModule } from './custom-components/landing/landing.module';
import { AppPermissionService } from './core/service/app-permission';
import { MobileProductSearchModule } from './custom-components/mobile/m-search/m-product-search/mobile-product-search.module';
import { FormsModule } from '@angular/forms';
import { CustomfacetserviceService } from './custom-components/custom-product/productfacets/custom-facet-list/customfacetservice.service';
import { FaqModule } from './custom-components/faq/faq.module';
import { CarouselCompModule } from './custom-components/carousel/carousel.module';
import { RequestQuoteModModule } from './custom-components/request-quote-mod/request-quote-mod.module';
import { CustomtradepopupModule } from './custom-components/mobile/m-tradeapp-popup/customtradepopup.module';
import { QuotesShareEvents } from './shared/customerQuotes/QuotesShareEvents.service';
import { CustomProductSearchService } from './core/service/CustomProductSearchService';
import { ProductSearchService } from '@spartacus/core';
import { WelcometextModule } from './custom-components/home-mainsection/welcometext/welcometext.module';

@NgModule({
  declarations: [
    AppComponent
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SpartacusModule,
    SpartacusAuth0ModuleConfig,
    LandingModule,
    Auth0ModuleConfig,
    CustomMiniCartModule,
    CustomLayoutRoutingModule,
    CreateAccountModule,
    HomeMainsectionModule,
    CarouselCompModule,
    Auth0CallBackModule,
    AccountdropdownModule,
    TopaccountModule,
    HelpSupportModule,
    CustomFooterModule,
    CustomPdpModule,
    CustomNavigationModule,
    CustomProductModule,
    BrowserAnimationsModule,
    ProductfacetsModule, 
    // CustomPdpModule,
    CustomNavigationModule,
    CustomProductModule,
    CustomViewCartModule,
    RequestQuoteModModule,
    QuickOrderModule,
    CustomOrderCheckoutModule,
    AccountModule,
    MobileProductSearchModule,
    FaqModule,
    CustomtradepopupModule,
    WelcometextModule,
  ],
  providers: [
    AppPermissionService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenValidator, multi: true },
    { provide: FacetService, useClass: CustomfacetserviceService },
    { provide: ProductSearchService, useClass: CustomProductSearchService },
    CreateAccountService,
    FindStoreService,
    Auth0TokenService,
    customCmsGaurd,
    FIUserAccountDetailsService,
    ShareEvents,
    AccountDropDownStateService,
    AccountPaymentService,
    CartItemContextSource,
    QuotesShareEvents,
    NgbActiveModal
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
