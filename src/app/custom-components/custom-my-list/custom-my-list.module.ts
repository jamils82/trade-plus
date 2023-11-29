import { RouterModule } from '@angular/router';
import { MediaModule, IconModule } from '@spartacus/storefront';
import { CustomPdpModule } from './../custom-pdp/custom-pdp.module';
import { QuickOrderModule } from './../quick-order/quick-order.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMyListComponent } from './custom-my-list/custom-my-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateMyListComponent } from './create-my-list/create-my-list.component';
import { CustomDirectiveModule } from 'src/app/custom-directive/custom-directive.module';
import { CmsConfig, ConfigModule, UrlModule, I18nModule } from '@spartacus/core';
import { EditMyListComponent } from './edit-my-list/edit-my-list.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { EditListNameComponent } from './edit-list-name/edit-list-name.component';
import { CustomLayoutRoutingModule } from 'src/app/core/config/custom-layout/custom-layout.module';
import { SpartacusModule } from 'src/app/spartacus/spartacus.module';
import { FilterPopupMobileComponent } from './filter-popup-mobile/filter-popup-mobile.component';



@NgModule({
  declarations: [
    CustomMyListComponent,
    CreateMyListComponent,
    EditMyListComponent,
    EditListNameComponent,
    FilterPopupMobileComponent
    
  ],
  imports: [
    CommonModule,
    MediaModule,
    UrlModule,
    I18nModule,
    IconModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,CustomDirectiveModule,
    NgbDatepickerModule,
 //   NgbDateRangepickerModule
    // NgSelectModule,
     FormsModule,
     ReactiveFormsModule,
     QuickOrderModule,
     CustomPdpModule,
     SharedComponentsModule,
     SpartacusModule,
     CustomLayoutRoutingModule,
     RouterModule
  ]
})
export class CustomMyListModule { }
