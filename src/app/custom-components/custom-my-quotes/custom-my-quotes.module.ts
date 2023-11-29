import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMyQuotesComponent } from './custom-my-quotes.component';
import { FormModule } from '@spartacus/organization/administration/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomDirectiveModule } from 'src/app/custom-directive/custom-directive.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { NgbDateRangepickerModule } from '../ngb-date-rangepicker/ngb-date-rangepicker.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { IconModule, MediaModule } from '@spartacus/storefront'; 
import { UrlModule, I18nModule } from '@spartacus/core';
import { ViewQuoteComponent } from './view-quote/view-quote.component';
import { AccountModule } from 'src/app/custom-pages/account/account.module';
import { RouterModule, Routes } from '@angular/router';
import { SpartacusModule } from 'src/app/spartacus/spartacus.module';
import { MyQuotesFilterPopupComponent } from './my-quotes-filter-popup/my-quotes-filter-popup.component';
import { AppPermissionService } from 'src/app/core/service/app-permission';
import { DemoMaterialModule } from 'src/app/custom-pages/custom-ordercheckout/material.module';
import dayjs, { Dayjs } from 'dayjs/esm';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  { path: '/quotesPage', component: CustomMyQuotesComponent},
  { path: '', component: CustomMyQuotesComponent  }
];


@NgModule({
  declarations: [
    CustomMyQuotesComponent,
    ViewQuoteComponent,
    MyQuotesFilterPopupComponent,
   
  ],
  imports: [
    CommonModule,
    // CustomLayoutRoutingModule,
    SpartacusModule,
    FormModule,
    ReactiveFormsModule,
    MatIconModule,
    DemoMaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatChipsModule,
    CustomDirectiveModule,
    NgbDatepickerModule,
    SharedComponentsModule,
    IconModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatPaginatorModule,
    NgbDateRangepickerModule, 
    MediaModule,
    UrlModule,
    I18nModule,
    FormsModule,
    AccountModule,
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
    RouterModule.forChild(routes),
  ],
  exports: [
    CustomMyQuotesComponent
  ],
  providers:[NgbModal]
})
export class CustomMyQuotesModule { }
