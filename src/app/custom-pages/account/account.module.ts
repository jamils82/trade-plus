import { ConfigModule } from '@spartacus/core';
import { CmsConfig } from '@spartacus/core';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { AcountPrefMainComponent } from './acount-pref-main/acount-pref-main.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormModule } from '@spartacus/organization/administration/components';
import { CustomOrderDeleveriesComponent } from '../custom-order-deleveries/custom-order-deleveries.component';
import { AccountLeftNavComponent } from './account-left-nav/account-left-nav.component';
import { CustomMyQuotesComponent } from 'src/app/custom-components/custom-my-quotes/custom-my-quotes.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { ChartsModule } from 'ng2-charts';

import {
  CustomAccountPaymentsComponent,
  MarchantFeesComponent,
  OtherPaymentOptionComponent,
  PayNowComponent,
} from './custom-account-payments/custom-account-payments.component';
import { XeroConnectPopupComponent } from './xero-connect-popup/xero-connect-popup.component';
import { MyobPopupComponent } from './myob-popup/myob-popup.component';
import {
  InvoiceDownloadDialogComponent,
  InvoicesAndAdjustmentsComponent,
} from './invoices-and-adjustments/invoices-and-adjustments.component';
import {
  StatementEmailDialogComponent,
  StatementsComponent,
} from './statements/statements.component';
import { PriceUpdatesComponent } from './price-updates/price-updates.component';
import { PriceFilesComponent } from './price-files/price-files.component';
import { DownloadUpdatesComponent } from './download-updates/download-updates.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@spartacus/storefront';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CustomDirectiveModule } from 'src/app/custom-directive/custom-directive.module';
import { DemoMaterialModule } from '../custom-ordercheckout/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SavePreferredEmailComponent } from './save-preferred-email/save-preferred-email.component';
import { NgbDateRangepickerModule } from 'src/app/custom-components/ngb-date-rangepicker/ngb-date-rangepicker.module';
import { PaymentsuccessComponent } from './custom-account-payments/paymentsuccess/paymentsuccess.component';
import { PaymentfailureComponent } from './custom-account-payments/paymentfailure/paymentfailure.component';
import { WebViewComponent } from './invoices-and-adjustments/web-view/web-view.component';
import { PrintListComponent } from './invoices-and-adjustments/print-list/print-list.component';
import { RouterModule } from '@angular/router';
import { FilterPopupInvoiceAdjustmentsComponent } from './invoices-and-adjustments/filter-popup-invoice-adjustments/filter-popup-invoice-adjustments.component';
import { ViewDownloadFormatComponent } from './download-updates/view-download-format/view-download-format.component';
import { CustomLayoutRoutingModule } from 'src/app/core/config/custom-layout/custom-layout.module';
import { CreateNewFormatComponent } from '../../custom-pages/account/download-updates/create-new-format/create-new-format.component'
import { EditNewFormatComponent } from './download-updates/edit-new-format/edit-new-format.component';
import { EditFormatDatePopup } from '../../custom-pages/account/download-updates/edit-new-format/edit-format-popups/edit-format-date-popup';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { DownloadFormatPopupComponent } from './invoices-and-adjustments/download-format-popup/download-format-popup.component'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs, { Dayjs } from 'dayjs/esm';
import { MultidownloadFormatComponent } from './invoices-and-adjustments/multidownload-format/multidownload-format.component';
@NgModule({
  declarations: [
    AcountPrefMainComponent,
    AccountLeftNavComponent,
    AccountDashboardComponent,
    CustomAccountPaymentsComponent,
    XeroConnectPopupComponent,
    MyobPopupComponent,
    InvoicesAndAdjustmentsComponent,
    StatementsComponent,
    PriceUpdatesComponent,
    PriceFilesComponent,
    InvoiceDownloadDialogComponent,
    DownloadUpdatesComponent,
    StatementEmailDialogComponent,
    SavePreferredEmailComponent,
    PayNowComponent,
    OtherPaymentOptionComponent,
    MarchantFeesComponent,
    PaymentsuccessComponent,
    PaymentfailureComponent,
    WebViewComponent,
    PrintListComponent,
    FilterPopupInvoiceAdjustmentsComponent,
    ViewDownloadFormatComponent,
    CreateNewFormatComponent,
    EditNewFormatComponent,
    EditFormatDatePopup,
    DownloadFormatPopupComponent,
    MultidownloadFormatComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CustomLayoutRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    NgbDateRangepickerModule,
    ChartsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    IconModule,
    NgxDaterangepickerMd.forRoot({
        format: 'DD/MM/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
        displayFormat: 'DD/MM/YYYY', // default is format value
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: '-', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Apply', // detault is 'Apply'
        clearLabel: 'Cancel', // detault is 'Clear'
        customRangeLabel: 'Custom range',
      
    }),
    CustomDirectiveModule,
    SharedComponentsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TLPreferencesComponent: {
          component: AcountPrefMainComponent,
        },
        TLOrderHistoryListComponent: {
         component: CustomOrderDeleveriesComponent,
       },
        TLMyQuotesListComponent: {
          component: CustomMyQuotesComponent,
        },
        TradeLinkDatacomPaymentSuccessFlexComponent: {
          component: PaymentsuccessComponent,
        },
        TradeLinkDatacomPaymentFailureFlexComponent: {
          component: PaymentfailureComponent,
        },
      },
    }),
  ],
  exports: [AcountPrefMainComponent, AccountLeftNavComponent, CommonModule],
})
export class AccountModule { }
