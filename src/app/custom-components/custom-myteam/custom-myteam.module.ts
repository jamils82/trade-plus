import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMyteamComponent } from './custom-myteam.component';
import { AddMemberPopUpComponent } from './add-member-pop-up/add-member-pop-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { NgbDatepickerModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateRangepickerComponent } from './../ngb-date-rangepicker/ngb-date-rangepicker.component'
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { DisableControlDirective } from 'src/app/custom-directive/disable-control.directive';
import { DeleteMemberPopUpComponent } from './delete-member-pop-up/delete-member-pop-up.component';
import { CustomDirectiveModule } from 'src/app/custom-directive/custom-directive.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { NgbDateRangepickerModule } from '../ngb-date-rangepicker/ngb-date-rangepicker.module';
import { CustomLayoutRoutingModule } from 'src/app/core/config/custom-layout/custom-layout.module';
import { SpartacusModule } from 'src/app/spartacus/spartacus.module';
import { FormatPricePipe } from 'src/app/shared/pipes/format-price.pipe';



@NgModule({
  declarations: [
    CustomMyteamComponent,
    AddMemberPopUpComponent,
    DisableControlDirective,
    DeleteMemberPopUpComponent,
    FormatPricePipe,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    NgbModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    CustomDirectiveModule,
    NgbDatepickerModule,
    NgbDateRangepickerModule,
    //   NgbDateRangepickerModule
    // NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SpartacusModule,
    CustomLayoutRoutingModule,

  ],
  providers: [NgbModal,
    FormatPricePipe]
  // exports: [ 
  //   CustomMyteamComponent,
  //   AddMemberPopUpComponent]
})
export class CustomMyteamModule { }
