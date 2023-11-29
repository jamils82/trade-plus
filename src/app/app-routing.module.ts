import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsPageGuard } from '@spartacus/storefront';
import { AppPermissionService } from './core/service/app-permission';


const routes: Routes = [
  {
    path: "/quotesPage",
    loadChildren: () => import("./custom-components/custom-my-quotes/custom-my-quotes.module").then(m => m.CustomMyQuotesModule),
  },
  {
    path: "/mylist",
    loadChildren: () => import("./custom-components/custom-my-list/custom-my-list.module").then(m => m.CustomMyListModule),
  },
  {
    path: "/teamManagementPage",
    loadChildren: () => import("./custom-components/custom-myteam/custom-myteam.module").then(m => m.CustomMyteamModule),
  },
  {
    path: "/preferencesPage",
    loadChildren: () => import("./custom-pages/account/account.module").then(m => m.AccountModule),

  },
  {
    path: "/customerQuotes",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/quotes.module").then(m => m.QuotesModule),

  },
  {
    path: "/create-new-quotes-popup",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/quotes.module").then(m => m.QuotesModule),

  },
  {
    path: "/quoteDetails/:id",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/job-detail/job-detail.module").then(m => m.JobDetailModule),

  },
  {
    path: "/quoteMaterials/:id",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/materials/materials.module").then(m => m.MaterialsModule),

  },
  {
    path: "/quoteCosts/:id",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/labour-cost/labour-cost.module").then(m => m.LabourCostModule),

  },
  {
    path: "/quoteReview/:id",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/review-quote/review-quote.module").then(m => m.ReviewQuoteModule),
  },
  {
    path: "/quoteView/:id",
    loadChildren: () => import("./custom-pages/custom-customerQuotes/view-quote/view-quote.module").then(m => m.ViewQuoteModule),
  },
  {
    path: "/tpQuickOrderPage",
    loadChildren: () => import("./custom-components/quick-order/quick-order.module").then(m => m.QuickOrderModule),
    // canActivate: [AppPermissionService]
  },
  {
    path: "/tpRequestQuotePage",
    // canActivate: [AppPermissionService],
    loadChildren: () => import("./custom-components//request-quote-mod/request-quote-mod.module").then(m => m.RequestQuoteModModule),

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    relativeLinkResolution: 'corrected',
    initialNavigation: 'enabled'
  }),
],
  exports: [RouterModule],
  providers: [AppPermissionService]
})
export class AppRoutingModule { }
