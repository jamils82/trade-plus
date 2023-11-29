import { FaqComponent } from './../../../custom-components/faq/faq.component';
import { CustomOrderCheckoutComponent } from './../../../custom-pages/custom-ordercheckout/custom-ordercheckout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule } from '@spartacus/core';
import { CmsPageGuard, LayoutConfig } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { CreateAccountComponent } from 'src/app/custom-components/create-account/create-account.component';
import { Auth0CallbackComponent } from 'src/app/custom-components/autho.callback/auth0-callback.component';
import { FindStoreComponent } from 'src/app/custom-components/find-store/find-store.component';
import { CustomOrderSummaryComponent } from 'src/app/custom-pages/custom-checkoutOrdersummary/custom-ordersummary.component';
import { CustomOrderConfirmationComponent } from 'src/app/custom-pages/custom-checkoutOrderconfirmation/custom-orderconfirmation.component';
import { CustomOrderDeleveriesComponent } from 'src/app/custom-pages/custom-order-deleveries/custom-order-deleveries.component';
import { AccountDashboardComponent } from 'src/app/custom-pages/account/account-dashboard/account-dashboard.component';
import { CustomAccountPaymentsComponent } from 'src/app/custom-pages/account/custom-account-payments/custom-account-payments.component';
import { DownloadUpdatesComponent } from 'src/app/custom-pages/account/download-updates/download-updates.component';
import { InvoicesAndAdjustmentsComponent } from 'src/app/custom-pages/account/invoices-and-adjustments/invoices-and-adjustments.component';
import { PriceFilesComponent } from 'src/app/custom-pages/account/price-files/price-files.component';
import { PriceUpdatesComponent } from 'src/app/custom-pages/account/price-updates/price-updates.component';
import { StatementsComponent } from 'src/app/custom-pages/account/statements/statements.component';
import { CustomProofOfDeliveryComponent } from 'src/app/custom-pages/custom-proof-of-delivery/custom-proof-of-delivery.component';
import { CustomMyListComponent } from 'src/app/custom-components/custom-my-list/custom-my-list/custom-my-list.component';
import { CustomMyQuotesComponent } from 'src/app/custom-components/custom-my-quotes/custom-my-quotes.component';
import { CustomMyteamComponent } from 'src/app/custom-components/custom-myteam/custom-myteam.component';
import { AcountPrefMainComponent } from 'src/app/custom-pages/account/acount-pref-main/acount-pref-main.component';
import { WebViewComponent } from 'src/app/custom-pages/account/invoices-and-adjustments/web-view/web-view.component';
import { LandingComponent } from 'src/app/custom-components/landing/landing.component';
import { PrintListComponent } from 'src/app/custom-pages/account/invoices-and-adjustments/print-list/print-list.component';
import { AppPermissionService } from '../../service/app-permission';
import { RequestquoteComponent } from 'src/app/custom-components/request-quote-mod/requestquote/requestquote.component';
import { QuickOrderComponent } from 'src/app/custom-components/quick-order/quick-order.component';
import { QuotesComponent } from 'src/app/custom-pages/custom-customerQuotes/quotes.component';
import { JobDetailComponent } from 'src/app/custom-pages/custom-customerQuotes/job-detail/job-detail.component';
import { MaterialsComponent } from 'src/app/custom-pages/custom-customerQuotes/materials/materials.component';
import { LabourCostComponent } from 'src/app/custom-pages/custom-customerQuotes/labour-cost/labour-cost.component';
import { CreateNewQuotesPopupComponent } from 'src/app/custom-pages/custom-customerQuotes/create-new-quotes-popup/create-new-quotes-popup.component';
import { ReviewQuoteComponent } from 'src/app/custom-pages/custom-customerQuotes/review-quote/review-quote.component';
import { ViewQuoteComponent } from 'src/app/custom-pages/custom-customerQuotes/view-quote/view-quote.component';
import { CreateNewFormatComponent } from 'src/app/custom-pages/account/download-updates/create-new-format/create-new-format.component';
import { EditNewFormatComponent } from 'src/app/custom-pages/account/download-updates/edit-new-format/edit-new-format.component';
import { SuccessPageComponent } from 'src/app/custom-components/landing/success-page/success-page.component';
// import { CustomProductNoticeComponent } from 'src/app/custom-components/product-notice/custom-product-notice.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        myListflexComponent: {
          component: CustomMyListComponent,
        },
        teamInviteListComponent: {
          component: CustomMyteamComponent,
        },
        TLPreferencesComponent: {
          component: AcountPrefMainComponent
        },
        TPQuickOrderFormComponent: {
          component: QuickOrderComponent
        },
        RequestQuoteComponent: {
          component: RequestquoteComponent
        }
      },
      layoutSlots: {
        header: {
          lg: {
            slots: [
              'SiteContext',
              'SiteLinks',
              'SiteLogo',
              // 'TLSiteLogoSlot',
              'SearchBox',
              'SiteLogin',
              'MiniCart',
              'NavigationBar',
              // 'QuickOrderButtonSlot',
            ],
          },
          slots: [
            'PreHeader',
            'SiteLogo',
            // 'TLSiteLogoSlot',
            'SearchBox',
            'MiniCart',
            'NavigationBar',
          ],
        },
        navigation: {
          lg: { slots: [] },
          slots: ['SiteLogin', 'NavigationBar', 'SiteContext', 'SiteLinks'],
        },
        footer: {
          slots: ['Footer'],
        },
        OrderChekoutTemplate: {},
        TPLandingPageTemplate: {
          pageFold: 'Section2B',
          slots: [
            // 'RequestQuoteButtonSlot',
            'ProductNoticeSlotLandingPage',
            'Section7A',
            'Section3A',
            'Section1',
            'Section4A',
            'Section5A',
            'Section5B',
            // 'Section3',
            // 'Section4',
            // 'Section5',
          ],
        },
        TLAuthLandingPageTemplate: {
          slots: ['TLAuthLandingPageSlot'],
        },
        ProductDetailsPageTemplate: {
          // pageFold: 'Section2B',
          slots: ['Summary', 'Tabs'],
        },
        ProductGridPageTemplate: {
          //slots: ['SearchBox','ProductLeftRefinements', 'ProductGridSlot'],
          slots: ['ProductLeftRefinements', 'ProductGridSlot'],
        },
        TeamManagementPageTemplate: {
          //slots: ['SearchBox','ProductLeftRefinements', 'ProductGridSlot'],
          slots: ['TeamInviteListSlot'],
        },
        SearchResultsGridPageTemplate: {
          slots: ['ProductLeftRefinements', 'SearchResultsGridSlot'],
        },
        TPQuickOrderPageTemplate: {
          slots: ['QuickOrder'],
        },
        MYListPageTemplate: {
          slots: ['myListSlot'],
        },

        TLPreferencePageTemplate: {
          slots: ['PreferencesListSlot'],
        },
        TLOrderHistoryPageTemplate: {
          slots: ['OrderHistorySlot'],
        },
        TLMyQuotesPageTemplate: {
          slots: ['MyQuotesListSlot'],
        },
        RequestQuoteTemplate: {
          slots: ['RequestQuoteSlot'],
        },
        TLAccountPageTemplate: {
          slots: ['AccountSlot'],
        },
        TLPaymentPageTemplate: {
          slots: ['PaymentSlot'],
        },
        TLInvoicePageTemplate: {
          slots: ['InvoiceSlot'],
        },
        TLStatementsPageTemplate: {
          slots: ['StatementsSlot'],
        },
        TLPriceFilesPageTemplate: {
          slots: ['PriceFilesSlot'],
        },
        TLDownloadFilesPageTemplate: {
          slots: ['DownloadFilesSlot'],
        },
        TLQuotesPageTemplate: {
          slots: ['QuoteMiddleSlot'],
        },
        ContentPage1Template: {
          slots: ['Section1']
        },
        TLCreateNewPageTemplate : {
          slots: ['QuoteMiddleSlot']
        },
        TLDownloadFormatsPageTemplate : {
          slots: ['DownloadFormatsMiddleSlot']
        },
        TLProductNoticePageTemplate : {
          slots: ['ProductNoticeSlot']
        }
        // LandingPage2Template: {
        //   lg: {
        //   }
        // },
        // LandingPage3Template: {},
        // LandingPage4Template: {}
      },
    } as LayoutConfig),
    RouterModule.forChild([
      //{
      //   path: '',
      //   component: Auth0CallbackComponent,
      //   canActivate: [customCmsGaurd]
      // },
      {
        path: 'callback',
        component: Auth0CallbackComponent,
        canActivate: [CmsPageGuard],
      },
      {
        path: 'linkAccount',
        component: CreateAccountComponent,
        //canActivate: [CmsPageGuard]
      },
      {
        path: 'findStore',
        component: FindStoreComponent,
        // canActivate: [CmsPageGuard]
      },
      {
        path: 'success',
        component: SuccessPageComponent,
      },
      {
        path: 'orderCheckoutPage',
        component: CustomOrderCheckoutComponent,
        canActivate: [CmsPageGuard],
      },
      {
        path: 'orderSummaryPage',
        component: CustomOrderSummaryComponent,
        canActivate: [CmsPageGuard],
      },
      {
        path: 'proofOfDelivery',
        component: CustomProofOfDeliveryComponent,
        // canActivate: [CmsPageGuard],
      },
      {
        path: 'orderConfirmation',
        component: CustomOrderConfirmationComponent,
        canActivate: [CmsPageGuard],
      },
      {
        path: 'accountPage',
        component: AccountDashboardComponent,
        canActivate: [CmsPageGuard, AppPermissionService],
      },
      {
        path: 'paymentPage',
        component: CustomAccountPaymentsComponent,
        canActivate: [CmsPageGuard, AppPermissionService],
      },
      {
        path: 'invoicePage',
        component: InvoicesAndAdjustmentsComponent,
        canActivate: [CmsPageGuard, AppPermissionService],
      },
      {
        path: 'statementsPage',
        component: StatementsComponent,
        canActivate: [CmsPageGuard, AppPermissionService],
      },
      {
        path: 'priceupdate',
        component: PriceUpdatesComponent,
        // canActivate: [CmsPageGuard],
      },
      {
        path: 'priceFilesPage',
        component: PriceFilesComponent,
        canActivate: [CmsPageGuard, AppPermissionService]
      },
      {
        path: 'tlAuthLandingPage',
        component: LandingComponent,
        canActivate: [CmsPageGuard],
      },
      {
        path: 'my-orders-deliveries',
        component: CustomOrderDeleveriesComponent,
        canActivate: [CmsPageGuard, AppPermissionService],
      },
      {
        path: 'web-view',
        component: WebViewComponent,
        // canActivate: [CmsPageGuard],
      },
      {
        path: 'print-list',
        component: PrintListComponent,
        // canActivate: [CmsPageGuard],
      },
      {
        path: 'quotesPage',
        canActivate: [CmsPageGuard, AppPermissionService],
        component: CustomMyQuotesComponent
      },
      // {
      //   path: 'tpRequestQuotePage',
      //   canActivate: [CmsPageGuard, AppPermissionService],
      //   component: RequestquoteComponent
      // },
      {
        path: 'customerQuotes',
        canActivate: [CmsPageGuard, AppPermissionService],
        component: QuotesComponent
      },
      {
        path: 'create-new-quotes-popup',
        canActivate: [CmsPageGuard, AppPermissionService],
        component: CreateNewQuotesPopupComponent
      },
    {
        path: 'quoteDetails/:id',
        // canActivate: [CmsPageGuard],
        component: JobDetailComponent
      },
      {
        path: 'quoteMaterials/:id',
        canActivate: [CmsPageGuard],
        component: MaterialsComponent
      },
      {
        path: 'quoteCosts/:id',
        canActivate: [CmsPageGuard],
        component: LabourCostComponent
      },
      {
        path: 'quoteReview/:id',
        canActivate: [CmsPageGuard],
        component: ReviewQuoteComponent
      },
      {
        path: 'quoteView/:id',
        canActivate: [CmsPageGuard],
        component: ViewQuoteComponent
      },
      // {
      //   path: 'tpQuickOrderPage',
      //   canActivate: [CmsPageGuard, AppPermissionService],
      //   component: QuickOrderComponent
      // },
      {
        path: 'faq',
        canActivate: [CmsPageGuard],
        component: FaqComponent
      },
      {
        path: 'downloadFilesPage',
        component: DownloadUpdatesComponent,
        canActivate: [CmsPageGuard, AppPermissionService],
      },
      {
        path:'downloadFilesPage/create',
        canActivate: [CmsPageGuard],
        component: CreateNewFormatComponent
      },
      {
        path:'downloadFilesPage/edit/:id',
        canActivate: [CmsPageGuard],
        component: EditNewFormatComponent
      },
      // {
      //   path:'product-notices',
      //   canActivate: [CmsPageGuard],
      //   component: CustomProductNoticeComponent
      // } 
    ]),
  ],
})
export class CustomLayoutRoutingModule { }
