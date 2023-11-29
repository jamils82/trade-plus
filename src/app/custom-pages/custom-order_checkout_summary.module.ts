import { UrlModule } from '@spartacus/core';
import { MediaModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '@spartacus/organization/administration/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from './custom-ordercheckout/material.module';
import { DialogComponent } from './custom-ordercheckout/custom-dialog/dialog.component';
import { CustomOrderCheckoutComponent } from './custom-ordercheckout/custom-ordercheckout.component';
import { CustomOrderSummaryComponent } from './custom-checkoutOrdersummary/custom-ordersummary.component';
import { DeliveryOrderComponent } from '../custom-components/checkout-delivery-order/delivery-order.component';
import { confirmationComponent } from '../custom-components/checkout-delivery-order/confirmatoin.component';
import { CustomOrderConfirmationComponent } from './custom-checkoutOrderconfirmation/custom-orderconfirmation.component';
import { DatePipe } from '@angular/common';
import { CustomOrderDeleveriesComponent } from './custom-order-deleveries/custom-order-deleveries.component';
import { CustomDirectiveModule } from 'src/app/custom-directive/custom-directive.module';
import { orderDetailsComponent } from '../custom-components/order-details/order-details.component';
import { CustomProofOfDeliveryComponent } from './custom-proof-of-delivery/custom-proof-of-delivery.component';
import { NgbDateRangepickerModule } from '../custom-components/ngb-date-rangepicker/ngb-date-rangepicker.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { OderDeliveriesFilterComponent } from './custom-order-deleveries/oder-deliveries-filter/oder-deliveries-filter.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
@NgModule({
  declarations: [
    CustomOrderCheckoutComponent,
    CustomOrderSummaryComponent,
    DialogComponent,
    DeliveryOrderComponent,
    confirmationComponent,
    CustomOrderConfirmationComponent,
    CustomOrderDeleveriesComponent,
    orderDetailsComponent,
    CustomProofOfDeliveryComponent,
    OderDeliveriesFilterComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    CustomDirectiveModule,
    NgbDateRangepickerModule,
    SharedComponentsModule,
    RouterModule,
    ReactiveFormsModule,
    MediaModule,
    FormModule,
    FormsModule,
    UrlModule,
    FormsModule,
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
  ],
  providers: [DatePipe],
})
export class CustomOrderCheckoutModule {}
