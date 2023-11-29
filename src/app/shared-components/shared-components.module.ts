import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToListComponent } from './add-to-list/add-to-list.component';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { CustomDirectiveModule } from '../custom-directive/custom-directive.module';
import { AddToListViewComponent } from './add-to-list-view/add-to-list-view.component';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { AddFromListComponent } from './add-from-list/add-from-list.component';
import { SharedMethodsService } from './shared-methods.service';
import { SharedSuccessMessageComponent } from './shared-success-message/shared-success-message.component';
import { SharedWarningPopupComponent } from './shared-warning-popup/shared-warning-popup.component';
import { DateFilterPopupComponent } from './date-filter-popup/date-filter-popup.component';
import { NgbDateRangepickerModule } from '../custom-components/ngb-date-rangepicker/ngb-date-rangepicker.module';
import { AddFromMyquotesComponent } from './add-from-myquotes/add-from-myquotes.component';
import { AddFromMylistComponent } from './add-from-mylist/add-from-mylist.component';
import { SharedErrorMessageComponent } from './shared-error-message/shared-error-message.component';



@NgModule({
  declarations: [
    AddToListComponent,
    AddToListViewComponent,
    DeletePopupComponent,
    AddFromListComponent,
    DateFilterPopupComponent,
    SharedSuccessMessageComponent,
    SharedWarningPopupComponent,
    AddFromMyquotesComponent,
    AddFromMylistComponent,
    SharedErrorMessageComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule, CustomDirectiveModule,
    NgbDatepickerModule,
    NgbDateRangepickerModule,
    // NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AddToListComponent,
    AddToListViewComponent,
    DeletePopupComponent,
    SharedSuccessMessageComponent,
    AddFromListComponent,
    DateFilterPopupComponent,
    SharedWarningPopupComponent,
    AddFromMylistComponent,
    AddFromMyquotesComponent
  ],
  providers: [NgbModal, SharedMethodsService]
})
export class SharedComponentsModule { }
